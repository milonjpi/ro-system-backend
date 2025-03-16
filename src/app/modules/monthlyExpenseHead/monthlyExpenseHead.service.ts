import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { MonthlyExpenseHead, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { IMonthlyExpenseHeadFilters } from './monthlyExpenseHead.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { monthlyExpenseHeadSearchableFields } from './monthlyExpenseHead.constant';

// create
const insertIntoDB = async (
  data: MonthlyExpenseHead
): Promise<MonthlyExpenseHead | null> => {
  const result = await prisma.monthlyExpenseHead.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// get all
const getAll = async (
  filters: IMonthlyExpenseHeadFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<MonthlyExpenseHead[]>> => {
  const { searchTerm, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: monthlyExpenseHeadSearchableFields.map(field => ({
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

  const whereConditions: Prisma.MonthlyExpenseHeadWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.monthlyExpenseHead.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
  });

  const total = await prisma.monthlyExpenseHead.count({
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
const getSingle = async (id: string): Promise<MonthlyExpenseHead | null> => {
  const result = await prisma.monthlyExpenseHead.findFirst({
    where: {
      id,
    },
  });

  return result;
};

// update
const updateSingle = async (
  id: string,
  payload: Partial<MonthlyExpenseHead>
): Promise<MonthlyExpenseHead | null> => {
  // check is exist
  const isExist = await prisma.monthlyExpenseHead.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.monthlyExpenseHead.update({
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
const deleteFromDB = async (id: string): Promise<MonthlyExpenseHead | null> => {
  // check is exist
  const isExist = await prisma.monthlyExpenseHead.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.monthlyExpenseHead.delete({
    where: {
      id,
    },
  });

  return result;
};

export const MonthlyExpenseHeadService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
