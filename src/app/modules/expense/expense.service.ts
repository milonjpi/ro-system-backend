import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { Expense, ExpenseDetail, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { IExpenseFilters } from './expense.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { expenseSearchableFields } from './expense.constant';

// create
const insertIntoDB = async (
  data: Expense,
  expenseDetails: ExpenseDetail[]
): Promise<Expense | null> => {
  const result = await prisma.expense.create({
    data: { ...data, expenseDetails: { create: expenseDetails } },
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// get all
const getAll = async (
  filters: IExpenseFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Expense[]>> => {
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
      OR: expenseSearchableFields.map(field => ({
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
        [field]: value === 'true' ? true : value === 'false' ? false : value,
      })),
    });
  }

  const whereConditions: Prisma.ExpenseWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.expense.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
  });

  const total = await prisma.expense.count({
    where: whereConditions,
  });
  const totalPage = Math.ceil(total / limit);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage,
    },
    data: result,
  };
};

// get single
const getSingle = async (id: string): Promise<Expense | null> => {
  const result = await prisma.expense.findUnique({
    where: {
      id,
    },
  });

  return result;
};

// update
const updateSingle = async (
  id: string,
  payload: Partial<Expense>,
  expenseDetails: ExpenseDetail[]
): Promise<Expense | null> => {
  // check is exist
  const isExist = await prisma.expense.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  if (isExist.status === 'Paid') {
    throw new ApiError(httpStatus.NOT_FOUND, 'You cant Update after paid');
  }
  if (isExist.status === 'Canceled') {
    throw new ApiError(httpStatus.NOT_FOUND, 'You cant Update after canceled');
  }

  const result = await prisma.$transaction(async trans => {
    await trans.expense.update({
      where: {
        id,
      },
      data: {
        expenseDetails: {
          deleteMany: {},
        },
      },
    });

    return await trans.expense.update({
      where: {
        id,
      },
      data: {
        ...payload,
        expenseDetails: {
          create: expenseDetails,
        },
      },
    });
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Update');
  }

  return result;
};

// delete
const deleteFromDB = async (id: string): Promise<Expense | null> => {
  // check is exist
  const isExist = await prisma.expense.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  if (isExist.status === 'Paid') {
    throw new ApiError(httpStatus.NOT_FOUND, 'You cant delete after Paid');
  }
  if (isExist.status === 'Canceled') {
    throw new ApiError(httpStatus.NOT_FOUND, 'You cant delete after canceled');
  }

  const result = await prisma.$transaction(async trans => {
    await trans.expense.update({
      where: {
        id,
      },
      data: {
        expenseDetails: {
          deleteMany: {},
        },
      },
    });

    return await trans.expense.delete({
      where: {
        id,
      },
    });
  });

  return result;
};

export const ExpenseService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
