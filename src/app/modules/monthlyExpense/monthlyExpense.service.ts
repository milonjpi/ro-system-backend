import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { MonthlyExpense, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import {
  IMonthlyExpenseFilters,
  IMonthlyExpenseResponse,
} from './monthlyExpense.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { monthlyExpenseSearchableFields } from './monthlyExpense.constant';

// create
const insertIntoDB = async (data: MonthlyExpense[]): Promise<string> => {
  const result = await prisma.monthlyExpense.createMany({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return 'Success';
};

// get all
const getAll = async (
  filters: IMonthlyExpenseFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IMonthlyExpenseResponse>> => {
  const { searchTerm, startDate, endDate, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: monthlyExpenseSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (startDate) {
    andConditions.push({
      date: {
        gte: new Date(`${startDate}, 00:00:00`),
      },
    });
  }
  if (endDate) {
    andConditions.push({
      date: {
        lte: new Date(`${endDate}, 23:59:59`),
      },
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.entries(filterData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const whereConditions: Prisma.MonthlyExpenseWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.monthlyExpense.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
    include: {
      expenseArea: true,
      vehicle: true,
      monthlyExpenseHead: true,
      paymentSource: {
        include: {
          openingBalances: {
            where: {
              month: filterData?.month || '123',
              year: filterData?.year || '123',
            },
          },
        },
      },
    },
  });

  const total = await prisma.monthlyExpense.count({
    where: whereConditions,
  });
  const totalPage = Math.ceil(total / limit);

  const totalAmount = await prisma.monthlyExpense.aggregate({
    where: whereConditions,
    _sum: {
      amount: true,
    },
  });

  return {
    meta: {
      page,
      limit,
      total,
      totalPage,
    },
    data: {
      data: result,
      sum: totalAmount,
    },
  };
};

// get single
const getSingle = async (id: string): Promise<MonthlyExpense | null> => {
  const result = await prisma.monthlyExpense.findFirst({
    where: {
      id,
    },
  });

  if (!result) return null;

  const { month, year } = result;

  const detailedResult = await prisma.monthlyExpense.findFirst({
    where: { id },
    include: {
      expenseArea: true,
      vehicle: true,
      monthlyExpenseHead: true,
      paymentSource: {
        include: {
          openingBalances: {
            where: {
              month,
              year,
            },
          },
        },
      },
    },
  });

  return detailedResult;
};

// update
const updateSingle = async (
  id: string,
  payload: Partial<MonthlyExpense>
): Promise<MonthlyExpense | null> => {
  // check is exist
  const isExist = await prisma.monthlyExpense.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.monthlyExpense.update({
    where: {
      id,
    },
    data: payload,
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Update');
  }

  return result;
};

// delete
const deleteFromDB = async (id: string): Promise<MonthlyExpense | null> => {
  // check is exist
  const isExist = await prisma.monthlyExpense.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.monthlyExpense.delete({
    where: {
      id,
    },
  });

  return result;
};

export const MonthlyExpenseService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
