import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { PaymentSource, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { paymentSourceSearchableFields } from './paymentSource.constant';
import { IPaymentSourceFilters } from './paymentSource.interface';

// create
const insertIntoDB = async (
  data: PaymentSource
): Promise<PaymentSource | null> => {
  const result = await prisma.paymentSource.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// get all
const getAll = async (
  filters: IPaymentSourceFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<PaymentSource[]>> => {
  const { searchTerm } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: paymentSourceSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  const whereConditions: Prisma.PaymentSourceWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.paymentSource.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
  });

  const total = await prisma.paymentSource.count({
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
const getSingle = async (id: string): Promise<PaymentSource | null> => {
  const result = await prisma.paymentSource.findUnique({
    where: {
      id,
    },
  });

  return result;
};

// update
const updateSingle = async (
  id: string,
  payload: Partial<PaymentSource>
): Promise<PaymentSource | null> => {
  // check is exist
  const isExist = await prisma.paymentSource.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.paymentSource.update({
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
const deleteFromDB = async (id: string): Promise<PaymentSource | null> => {
  // check is exist
  const isExist = await prisma.paymentSource.findUnique({
    where: {
      id,
    },
    include: {
      monthlyExpenses: true,
      openingBalances: true,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  if (isExist.monthlyExpenses?.length || isExist.openingBalances?.length) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `${
        (isExist.monthlyExpenses?.length || 0) +
        (isExist.openingBalances?.length || 0)
      } Documents Engaged with this`
    );
  }

  const result = await prisma.paymentSource.delete({
    where: {
      id,
    },
  });

  return result;
};

export const PaymentSourceService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
