import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { PaymentMethod, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { IPaymentMethodFilters } from './paymentMethod.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { paymentMethodSearchableFields } from './paymentMethod.constant';

// create
const insertIntoDB = async (
  data: PaymentMethod
): Promise<PaymentMethod | null> => {
  const result = await prisma.paymentMethod.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// get all
const getAll = async (
  filters: IPaymentMethodFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<PaymentMethod[]>> => {
  const { searchTerm } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: paymentMethodSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  const whereConditions: Prisma.PaymentMethodWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.paymentMethod.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
  });

  const total = await prisma.paymentMethod.count({
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
const getSingle = async (id: string): Promise<PaymentMethod | null> => {
  const result = await prisma.paymentMethod.findFirst({
    where: {
      id,
    },
  });

  return result;
};

// update
const updateSingle = async (
  id: string,
  payload: Partial<PaymentMethod>
): Promise<PaymentMethod | null> => {
  // check is exist
  const isExist = await prisma.paymentMethod.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.paymentMethod.update({
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
const deleteFromDB = async (id: string): Promise<PaymentMethod | null> => {
  // check is exist
  const isExist = await prisma.paymentMethod.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.paymentMethod.delete({
    where: {
      id,
    },
  });

  return result;
};

export const PaymentMethodService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
