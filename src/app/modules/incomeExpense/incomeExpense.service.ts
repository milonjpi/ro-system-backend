import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { IncomeExpense, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import {
  IIncomeExpenseFilters,
  IIncomeExpenseResponse,
  IInExSummaryFilters,
  IInExSummaryReport,
} from './incomeExpense.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { incomeExpenseSearchableFields } from './incomeExpense.constant';

// create
const insertIntoDB = async (
  data: IncomeExpense
): Promise<IncomeExpense | null> => {
  const result = await prisma.incomeExpense.create({
    data,
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// get all
const getAll = async (
  filters: IIncomeExpenseFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IIncomeExpenseResponse>> => {
  const { searchTerm, startDate, endDate, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

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

  if (searchTerm) {
    andConditions.push({
      OR: incomeExpenseSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.entries(filterData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const whereConditions: Prisma.IncomeExpenseWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.incomeExpense.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
    include: {
      category: true,
      incomeExpenseHead: true,
      modeOfPayment: true,
    },
  });

  const total = await prisma.incomeExpense.count({
    where: whereConditions,
  });
  const totalPage = Math.ceil(total / limit);

  const totalAmount = await prisma.incomeExpense.aggregate({
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
const getSingle = async (id: string): Promise<IncomeExpense | null> => {
  const result = await prisma.incomeExpense.findUnique({
    where: {
      id,
    },
    include: {
      category: true,
      incomeExpenseHead: true,
      modeOfPayment: true,
    },
  });

  return result;
};

// update
const updateSingle = async (
  id: string,
  payload: Partial<IncomeExpense>
): Promise<IncomeExpense | null> => {
  // check is exist
  const isExist = await prisma.incomeExpense.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.incomeExpense.update({
    where: { id },
    data: payload,
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Update');
  }

  return result;
};

// delete
const deleteFromDB = async (id: string): Promise<IncomeExpense | null> => {
  // check is exist
  const isExist = await prisma.incomeExpense.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.incomeExpense.delete({ where: { id } });

  return result;
};

// get all summary
const getAllSummary = async (
  filters: IInExSummaryFilters
): Promise<IInExSummaryReport[]> => {
  const { startDate, endDate, ...filterData } = filters;

  const andConditions = [];

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

  const whereConditions: Prisma.IncomeExpenseWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.incomeExpense.groupBy({
    where: whereConditions,
    by: ['incomeExpenseHeadId'],
    _sum: {
      amount: true,
    },
  });
  const allHead = await prisma.incomeExpenseHead.findMany({
    include: { category: true },
  });

  const mainResult = result?.map(el => {
    const findHead = allHead?.find(ah => ah.id === el.incomeExpenseHeadId);
    return {
      category: findHead?.category?.label,
      head: findHead?.label,
      amount: el._sum?.amount || 0,
    };
  });

  return mainResult;
};

export const IncomeExpenseService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
  getAllSummary,
};
