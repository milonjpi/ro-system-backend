import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { ModeOfPayment, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { IModeOfPaymentFilters } from './modeOfPayment.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { modeOfPaymentSearchableFields } from './modeOfPayment.constant';

// create
const insertIntoDB = async (
  data: ModeOfPayment
): Promise<ModeOfPayment | null> => {
  const result = await prisma.modeOfPayment.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// get all
const getAll = async (
  filters: IModeOfPaymentFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<ModeOfPayment[]>> => {
  const { searchTerm } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: modeOfPaymentSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  const whereConditions: Prisma.ModeOfPaymentWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.modeOfPayment.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
  });

  const total = await prisma.modeOfPayment.count({
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
const getSingle = async (id: string): Promise<ModeOfPayment | null> => {
  const result = await prisma.modeOfPayment.findUnique({
    where: {
      id,
    },
  });

  return result;
};

// update
const updateSingle = async (
  id: string,
  payload: Partial<ModeOfPayment>
): Promise<ModeOfPayment | null> => {
  // check is exist
  const isExist = await prisma.modeOfPayment.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.modeOfPayment.update({
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
const deleteFromDB = async (id: string): Promise<ModeOfPayment | null> => {
  // check is exist
  const isExist = await prisma.modeOfPayment.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.modeOfPayment.delete({
    where: {
      id,
    },
  });

  return result;
};

export const ModeOfPaymentService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
