import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { Withdraw, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { IWithdrawFilters, IWithdrawResponse } from './withdraw.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { withdrawSearchableFields } from './withdraw.constant';

// create
const insertIntoDB = async (data: Withdraw): Promise<Withdraw | null> => {
  // set account head
  const findAccountHead = await prisma.accountHead.findFirst({
    where: { label: 'CASH AND EQUIVALENT' },
  });

  if (!findAccountHead) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Account Head Missing');
  }
  data.accountHeadId = findAccountHead.id;

  const result = await prisma.withdraw.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// get all
const getAll = async (
  filters: IWithdrawFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IWithdrawResponse>> => {
  const { searchTerm, startDate, endDate } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: withdrawSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

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

  const whereConditions: Prisma.WithdrawWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.withdraw.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
  });

  const total = await prisma.withdraw.count({
    where: whereConditions,
  });
  const totalPage = Math.ceil(total / limit);

  const totalAmount = await prisma.withdraw.aggregate({
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
const getSingle = async (id: string): Promise<Withdraw | null> => {
  const result = await prisma.withdraw.findUnique({
    where: {
      id,
    },
  });

  return result;
};

// update
const updateSingle = async (
  id: string,
  payload: Partial<Withdraw>
): Promise<Withdraw | null> => {
  // check is exist
  const isExist = await prisma.withdraw.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Record Not Found');
  }

  const result = await prisma.withdraw.update({
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
const deleteFromDB = async (id: string): Promise<Withdraw | null> => {
  // check is exist
  const isExist = await prisma.withdraw.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Record Not Found');
  }

  const result = await prisma.withdraw.delete({
    where: {
      id,
    },
  });

  return result;
};

export const WithdrawService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
