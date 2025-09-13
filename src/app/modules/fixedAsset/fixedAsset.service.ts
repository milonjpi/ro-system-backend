import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { FixedAsset, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import {
  IFixedAssetFilters,
  IFixedAssetResponse,
} from './fixedAsset.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { fixedAssetSearchableFields } from './fixedAsset.constant';

// create
const insertIntoDB = async (data: FixedAsset): Promise<FixedAsset | null> => {
  // set account head
  const findAccountHead = await prisma.accountHead.findFirst({
    where: { label: 'FIXED ASSET' },
  });

  if (!findAccountHead) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Account Head Missing');
  }
  data.accountHeadId = findAccountHead.id;

  const result = await prisma.fixedAsset.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// get all
const getAll = async (
  filters: IFixedAssetFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IFixedAssetResponse>> => {
  const { searchTerm, startDate, endDate, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: fixedAssetSearchableFields.map(field => ({
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

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.entries(filterData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const whereConditions: Prisma.FixedAssetWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.fixedAsset.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
    include: {
      asset: true,
    },
  });

  const total = await prisma.fixedAsset.count({
    where: whereConditions,
  });
  const totalPage = Math.ceil(total / limit);

  const totalAmount = await prisma.fixedAsset.aggregate({
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
const getSingle = async (id: string): Promise<FixedAsset | null> => {
  const result = await prisma.fixedAsset.findFirst({
    where: {
      id,
    },
    include: {
      asset: true,
    },
  });

  return result;
};

// update
const updateSingle = async (
  id: string,
  payload: Partial<FixedAsset>
): Promise<FixedAsset | null> => {
  // check is exist
  const isExist = await prisma.fixedAsset.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.fixedAsset.update({
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
const deleteFromDB = async (id: string): Promise<FixedAsset | null> => {
  // check is exist
  const isExist = await prisma.fixedAsset.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.fixedAsset.delete({
    where: {
      id,
    },
  });

  return result;
};

export const FixedAssetService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
