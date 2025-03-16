import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { ExpenseType, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { expenseTypeSearchableFields } from './expenseType.constant';
import { IExpenseTypeFilters } from './expenseType.interface';

// create
const insertIntoDB = async (data: ExpenseType): Promise<ExpenseType | null> => {
  const result = await prisma.expenseType.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// get all
const getAll = async (
  filters: IExpenseTypeFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<ExpenseType[]>> => {
  const { searchTerm } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: expenseTypeSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  const whereConditions: Prisma.ExpenseTypeWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.expenseType.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
  });

  const total = await prisma.expenseType.count({
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
const getSingle = async (id: string): Promise<ExpenseType | null> => {
  const result = await prisma.expenseType.findUnique({
    where: {
      id,
    },
  });

  return result;
};

// update
const updateSingle = async (
  id: string,
  payload: Partial<ExpenseType>
): Promise<ExpenseType | null> => {
  // check is exist
  const isExist = await prisma.expenseType.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.expenseType.update({
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
const deleteFromDB = async (id: string): Promise<ExpenseType | null> => {
  // check is exist
  const isExist = await prisma.expenseType.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.expenseType.delete({
    where: {
      id,
    },
  });

  return result;
};

export const ExpenseTypeService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
