import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { IncomeExpenseHead, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { IIncomeExpenseHeadFilters } from './incomeExpenseHead.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { incomeExpenseHeadSearchableFields } from './incomeExpenseHead.constant';

// create
const insertIntoDB = async (
  data: IncomeExpenseHead
): Promise<IncomeExpenseHead | null> => {
  const result = await prisma.incomeExpenseHead.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// get all
const getAll = async (
  filters: IIncomeExpenseHeadFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IncomeExpenseHead[]>> => {
  const { searchTerm } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: incomeExpenseHeadSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  const whereConditions: Prisma.IncomeExpenseHeadWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.incomeExpenseHead.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
  });

  const total = await prisma.incomeExpenseHead.count({
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
const getSingle = async (id: string): Promise<IncomeExpenseHead | null> => {
  const result = await prisma.incomeExpenseHead.findUnique({
    where: {
      id,
    },
  });

  return result;
};

// update
const updateSingle = async (
  id: string,
  payload: Partial<IncomeExpenseHead>
): Promise<IncomeExpenseHead | null> => {
  // check is exist
  const isExist = await prisma.incomeExpenseHead.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.incomeExpenseHead.update({
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
const deleteFromDB = async (id: string): Promise<IncomeExpenseHead | null> => {
  // check is exist
  const isExist = await prisma.incomeExpenseHead.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.incomeExpenseHead.delete({
    where: {
      id,
    },
  });

  return result;
};

export const IncomeExpenseHeadService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
