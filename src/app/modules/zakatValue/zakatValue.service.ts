import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { ZakatValue, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import {
  ISingleZakatValue,
  IZakatValueFilters,
  IZakatValueResponse,
} from './zakatValue.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';

// create
const insertIntoDB = async (data: ZakatValue): Promise<ZakatValue | null> => {
  const result = await prisma.zakatValue.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// get all
const getAll = async (
  filters: IZakatValueFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IZakatValueResponse>> => {
  const { year } = filters;
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (year) {
    andConditions.push({ year });
  }

  const whereConditions: Prisma.ZakatValueWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.zakatValue.findMany({
    where: whereConditions,
    orderBy: { year: 'desc' },
    skip,
    take: limit,
  });

const mappedResult = await Promise.all(
  result.map(async (el) => {
    const findPaid = await prisma.zakat.aggregate({
      where: { year: el.year },
      _sum: { amount: true },
    });

    return {
      ...el,
      paidAmount: findPaid._sum.amount || 0,
    };
  })
);

  const total = await prisma.zakatValue.count({
    where: whereConditions,
  });
  const totalPage = Math.ceil(total / limit);

  const totalAmount = await prisma.zakatValue.aggregate({
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
      data: mappedResult,
      sum: totalAmount,
    },
  };
};

// get single
const getSingle = async (year: string): Promise<ISingleZakatValue | null> => {
  const result = await prisma.zakatValue.findFirst({
    where: {
      year,
    },
  });

  if (!result) {
    return null;
  }

  const paidZakat = await prisma.zakat.aggregate({
    where: { year },
    _sum: { amount: true },
  });

  return {
    year: result.year,
    amount: result.amount,
    paid: paidZakat?._sum?.amount || 0,
  };
};

// update
const updateSingle = async (
  id: string,
  payload: Partial<ZakatValue>
): Promise<ZakatValue | null> => {
  // check is exist
  const isExist = await prisma.zakatValue.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.zakatValue.update({
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
const deleteFromDB = async (id: string): Promise<ZakatValue | null> => {
  // check is exist
  const isExist = await prisma.zakatValue.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.zakatValue.delete({
    where: {
      id,
    },
  });

  return result;
};

export const ZakatValueService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
