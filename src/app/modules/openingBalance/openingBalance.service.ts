import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { OpeningBalance, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import {
  IOpeningBalanceFilters,
  IPresentBalance,
} from './openingBalance.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { openingBalanceSearchableFields } from './openingBalance.constant';

// create
const insertIntoDB = async (
  data: OpeningBalance
): Promise<OpeningBalance | null> => {
  const result = await prisma.openingBalance.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// get all
const getAll = async (
  filters: IOpeningBalanceFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<OpeningBalance[]>> => {
  const { searchTerm, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: openingBalanceSearchableFields.map(field => ({
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

  const whereConditions: Prisma.OpeningBalanceWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.openingBalance.findMany({
    where: whereConditions,
    orderBy: [
      {
        year: 'desc',
      },
      {
        [sortBy]: sortOrder,
      },
    ],
    skip,
    take: limit,
  });

  const total = await prisma.openingBalance.count({
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
const getSingle = async (id: string): Promise<OpeningBalance | null> => {
  const result = await prisma.openingBalance.findFirst({
    where: {
      id,
    },
  });

  return result;
};

// update
const updateSingle = async (
  id: string,
  payload: Partial<OpeningBalance>
): Promise<OpeningBalance | null> => {
  // check is exist
  const isExist = await prisma.openingBalance.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.openingBalance.update({
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
const deleteFromDB = async (id: string): Promise<OpeningBalance | null> => {
  // check is exist
  const isExist = await prisma.openingBalance.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.openingBalance.delete({
    where: {
      id,
    },
  });

  return result;
};

// present balance
const presentBalance = async (
  filters: {
    year: string;
    month: string;
  },
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IPresentBalance[]>> => {
  const { ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.entries(filterData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const whereConditions: Prisma.OpeningBalanceWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.openingBalance.findMany({
    where: whereConditions,
    orderBy: [
      {
        year: 'desc',
      },
      {
        [sortBy]: sortOrder,
      },
    ],
    skip,
    take: limit,
  });

  const total = await prisma.openingBalance.count({
    where: whereConditions,
  });
  const totalPage = Math.ceil(total / limit);

  const costAmount = await prisma.monthlyExpense.groupBy({
    where: {
      OR: [
        {
          paymentSource: {
            label: {
              contains: 'cash',
              mode: 'insensitive',
            },
          },
        },
        {
          paymentSource: {
            label: {
              contains: 'npsb',
              mode: 'insensitive',
            },
          },
        },
      ],
    },
    by: ['year', 'month'],
    _sum: { amount: true },
  });

  const mapResult = result.map(el => {
    const findCost = costAmount.find(
      bl => bl.year === el.year && bl.month === el.month
    );
    return {
      ...el,
      cost: findCost?._sum?.amount || 0,
    };
  });

  return {
    meta: {
      page,
      limit,
      total,
      totalPage,
    },
    data: mapResult,
  };
};

export const OpeningBalanceService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
  presentBalance,
};
