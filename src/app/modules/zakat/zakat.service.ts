import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { Zakat, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { IZakatFilters, IZakatResponse } from './zakat.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { zakatSearchableFields } from './zakat.constant';

// create
const insertIntoDB = async (data: Zakat): Promise<Zakat | null> => {
  const result = await prisma.zakat.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// get all
const getAll = async (
  filters: IZakatFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IZakatResponse>> => {
  const { searchTerm, ...filterData } = filters;
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: zakatSearchableFields.map(field => ({
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

  const whereConditions: Prisma.ZakatWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.zakat.findMany({
    where: whereConditions,
    orderBy: [
      {
        year: 'asc',
      },
      {
        recipient: { fullName: 'asc' },
      },
    ],
    skip,
    take: limit,
    include: {
      recipient: true,
    },
  });

  const total = await prisma.zakat.count({
    where: whereConditions,
  });
  const totalPage = Math.ceil(total / limit);

  const totalAmount = await prisma.zakat.aggregate({
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
const getSingle = async (id: string): Promise<Zakat | null> => {
  const result = await prisma.zakat.findFirst({
    where: {
      id,
    },
    include: {
      recipient: true,
    },
  });

  return result;
};

// update
const updateSingle = async (
  id: string,
  payload: Partial<Zakat>
): Promise<Zakat | null> => {
  // check is exist
  const isExist = await prisma.zakat.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.zakat.update({
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
const deleteFromDB = async (id: string): Promise<Zakat | null> => {
  // check is exist
  const isExist = await prisma.zakat.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.zakat.delete({
    where: {
      id,
    },
  });

  return result;
};

export const ZakatService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
