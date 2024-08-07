import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { Investment, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import {
  IInvestmentFilters,
  IInvestmentResponse,
} from './investment.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { investmentSearchableFields } from './investment.constant';

// create
const insertIntoDB = async (data: Investment): Promise<Investment | null> => {
  // set account head
  const findAccountHead = await prisma.accountHead.findFirst({
    where: { label: 'CASH AND EQUIVALENT' },
  });

  if (!findAccountHead) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Account Head Missing');
  }
  data.accountHeadId = findAccountHead.id;

  const result = await prisma.investment.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// get all
const getAll = async (
  filters: IInvestmentFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IInvestmentResponse>> => {
  const { searchTerm, startDate, endDate, isCash } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: investmentSearchableFields.map(field => ({
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

  if (isCash) {
    andConditions.push({
      isCash: isCash === 'true' ? true : false,
    });
  }

  const whereConditions: Prisma.InvestmentWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.investment.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
  });

  const total = await prisma.investment.count({
    where: whereConditions,
  });
  const totalPage = Math.ceil(total / limit);

  const totalAmount = await prisma.investment.aggregate({
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
const getSingle = async (id: string): Promise<Investment | null> => {
  const result = await prisma.investment.findUnique({
    where: {
      id,
    },
  });

  return result;
};

// update
const updateSingle = async (
  id: string,
  payload: Partial<Investment>
): Promise<Investment | null> => {
  // check is exist
  const isExist = await prisma.investment.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Record Not Found');
  }

  const result = await prisma.investment.update({
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
const deleteFromDB = async (id: string): Promise<Investment | null> => {
  // check is exist
  const isExist = await prisma.investment.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Record Not Found');
  }

  const result = await prisma.investment.delete({
    where: {
      id,
    },
  });

  return result;
};

export const InvestmentService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
