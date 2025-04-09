import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { ExpenseDetail, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { IExpenseDetailFilters } from './expenseDetail.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { expenseDetailSearchableFields } from './expenseDetail.constant';

// create
const insertIntoDB = async (
  data: ExpenseDetail
): Promise<ExpenseDetail | null> => {
  const result = await prisma.expenseDetail.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// get all
const getAll = async (
  filters: IExpenseDetailFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<ExpenseDetail[]>> => {
  const { searchTerm } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: expenseDetailSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  const whereConditions: Prisma.ExpenseDetailWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.expenseDetail.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
  });

  const total = await prisma.expenseDetail.count({
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
const getSingle = async (id: string): Promise<ExpenseDetail | null> => {
  const result = await prisma.expenseDetail.findFirst({
    where: {
      id,
    },
  });

  return result;
};

// update
const updateSingle = async (
  id: string,
  payload: Partial<ExpenseDetail>
): Promise<ExpenseDetail | null> => {
  // check is exist
  const isExist = await prisma.expenseDetail.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.expenseDetail.update({
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
const deleteFromDB = async (id: string): Promise<ExpenseDetail | null> => {
  // check is exist
  const isExist = await prisma.expenseDetail.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.expenseDetail.delete({
    where: {
      id,
    },
  });

  return result;
};

export const ExpenseDetailService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
