import httpStatus from 'http-status';
import { JewelleryCategory, JewelleryRate, Prisma } from '@prisma/client';
import { IJewelleryRateFilters } from './jewelleryRate.interface';
import prisma from '../../../../shared/prisma';
import ApiError from '../../../../errors/ApiError';
import { IPaginationOptions } from '../../../../interfaces/pagination';
import { IGenericResponse } from '../../../../interfaces/common';
import { paginationHelpers } from '../../../../helpers/paginationHelper';

// create
const insertIntoDB = async (
  data: JewelleryRate
): Promise<JewelleryRate | null> => {
  const result = await prisma.jewelleryRate.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// get all
const getAll = async (
  filters: IJewelleryRateFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<JewelleryRate[]>> => {
  const { category, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (category) {
    andConditions.push({
      carat: {
        is: {
          category: category as JewelleryCategory,
        },
      },
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.entries(filterData).map(([field, value]) => ({
        [field]: value === 'true' ? true : value === 'false' ? false : value,
      })),
    });
  }

  const whereConditions: Prisma.JewelleryRateWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.jewelleryRate.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
    include: {
      carat: true,
    },
  });

  const total = await prisma.jewelleryRate.count({
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

// get distinct date
const getDistinctDate = async (
  filters: IJewelleryRateFilters
): Promise<JewelleryRate[]> => {
  const { category, ...filterData } = filters;

  const andConditions = [];

  if (category) {
    andConditions.push({
      carat: {
        is: {
          category: category as JewelleryCategory,
        },
      },
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.entries(filterData).map(([field, value]) => ({
        [field]: value === 'true' ? true : value === 'false' ? false : value,
      })),
    });
  }

  const whereConditions: Prisma.JewelleryRateWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.jewelleryRate.findMany({
    where: whereConditions,
    orderBy: { date: 'desc' },
    distinct: ['date'],
  });

  return result;
};

// get single
const getSingle = async (id: string): Promise<JewelleryRate | null> => {
  const result = await prisma.jewelleryRate.findFirst({
    where: {
      id,
    },
    include: {
      carat: true,
    },
  });

  return result;
};

// update
const updateSingle = async (
  id: string,
  payload: Partial<JewelleryRate>
): Promise<JewelleryRate | null> => {
  // check is exist
  const isExist = await prisma.jewelleryRate.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.jewelleryRate.update({
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
const deleteFromDB = async (id: string): Promise<JewelleryRate | null> => {
  // check is exist
  const isExist = await prisma.jewelleryRate.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.jewelleryRate.delete({
    where: {
      id,
    },
  });

  return result;
};

export const JewelleryRateService = {
  insertIntoDB,
  getAll,
  getDistinctDate,
  getSingle,
  updateSingle,
  deleteFromDB,
};
