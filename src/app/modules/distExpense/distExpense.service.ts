import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { DistExpense, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import {
  IDistExpenseFilters,
  IDistExpenseResponse,
} from './distExpense.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { distExpenseSearchableFields } from './distExpense.constant';

// create
const insertIntoDB = async (data: DistExpense): Promise<DistExpense | null> => {
  const result = await prisma.distExpense.create({
    data,
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// get all
const getAll = async (
  filters: IDistExpenseFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IDistExpenseResponse>> => {
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
      OR: distExpenseSearchableFields.map(field => ({
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

  const whereConditions: Prisma.DistExpenseWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.distExpense.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
    include: {
      distributor: true,
      expenseHead: true,
      preparedBy: true,
    },
  });

  const total = await prisma.distExpense.count({
    where: whereConditions,
  });
  const totalPage = Math.ceil(total / limit);

  const totalAmount = await prisma.distExpense.aggregate({
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
const getSingle = async (id: string): Promise<DistExpense | null> => {
  const result = await prisma.distExpense.findFirst({
    where: {
      id,
    },
    include: {
      distributor: true,
      expenseHead: true,
      preparedBy: true,
    },
  });

  return result;
};

// update
const updateSingle = async (
  id: string,
  payload: Partial<DistExpense>
): Promise<DistExpense | null> => {
  // check is exist
  const isExist = await prisma.distExpense.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.distExpense.update({
    where: { id },
    data: payload,
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Update');
  }

  return result;
};

// delete
const deleteFromDB = async (id: string): Promise<DistExpense | null> => {
  // check is exist
  const isExist = await prisma.distExpense.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.distExpense.delete({ where: { id } });

  return result;
};

export const DistExpenseService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
