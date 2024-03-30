import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { IncomeExpenseCategory, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { IIncomeExpenseCategoryFilters } from './incomeExpenseCategory.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { incomeExpenseCategorySearchableFields } from './incomeExpenseCategory.constant';

// create
const insertIntoDB = async (
  data: IncomeExpenseCategory
): Promise<IncomeExpenseCategory | null> => {
  const result = await prisma.incomeExpenseCategory.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// get all
const getAll = async (
  filters: IIncomeExpenseCategoryFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IncomeExpenseCategory[]>> => {
  const { searchTerm } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: incomeExpenseCategorySearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  const whereConditions: Prisma.IncomeExpenseCategoryWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.incomeExpenseCategory.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
  });

  const total = await prisma.incomeExpenseCategory.count({
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
const getSingle = async (id: string): Promise<IncomeExpenseCategory | null> => {
  const result = await prisma.incomeExpenseCategory.findUnique({
    where: {
      id,
    },
  });

  return result;
};

// update
const updateSingle = async (
  id: string,
  payload: Partial<IncomeExpenseCategory>
): Promise<IncomeExpenseCategory | null> => {
  // check is exist
  const isExist = await prisma.incomeExpenseCategory.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.incomeExpenseCategory.update({
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
const deleteFromDB = async (
  id: string
): Promise<IncomeExpenseCategory | null> => {
  // check is exist
  const isExist = await prisma.incomeExpenseCategory.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.incomeExpenseCategory.delete({
    where: {
      id,
    },
  });

  return result;
};

export const IncomeExpenseCategoryService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
