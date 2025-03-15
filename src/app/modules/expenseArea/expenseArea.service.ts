import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { ExpenseArea, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { IExpenseAreaFilters } from './expenseArea.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { expenseAreaSearchableFields } from './expenseArea.constant';

// create
const insertIntoDB = async (data: ExpenseArea): Promise<ExpenseArea | null> => {
  const result = await prisma.expenseArea.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// get all
const getAll = async (
  filters: IExpenseAreaFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<ExpenseArea[]>> => {
  const { searchTerm } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: expenseAreaSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  const whereConditions: Prisma.ExpenseAreaWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.expenseArea.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
  });

  const total = await prisma.expenseArea.count({
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
const getSingle = async (id: string): Promise<ExpenseArea | null> => {
  const result = await prisma.expenseArea.findFirst({
    where: {
      id,
    },
  });

  return result;
};

// update
const updateSingle = async (
  id: string,
  payload: Partial<ExpenseArea>
): Promise<ExpenseArea | null> => {
  // check is exist
  const isExist = await prisma.expenseArea.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.expenseArea.update({
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
const deleteFromDB = async (id: string): Promise<ExpenseArea | null> => {
  // check is exist
  const isExist = await prisma.expenseArea.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.expenseArea.delete({
    where: {
      id,
    },
  });

  return result;
};

export const ExpenseAreaService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
