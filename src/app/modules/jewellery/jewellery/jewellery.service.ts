import httpStatus from 'http-status';
import { Jewellery, Prisma } from '@prisma/client';
import { IJewelleryFilters, IJewelleryResponse } from './jewellery.interface';
import { jewellerySearchableFields } from './jewellery.constant';
import prisma from '../../../../shared/prisma';
import ApiError from '../../../../errors/ApiError';
import { IPaginationOptions } from '../../../../interfaces/pagination';
import { IGenericResponse } from '../../../../interfaces/common';
import { paginationHelpers } from '../../../../helpers/paginationHelper';

// create
const insertIntoDB = async (data: Jewellery[]): Promise<string | null> => {
  const result = await prisma.jewellery.createMany({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return 'success';
};

// get all
const getAll = async (
  filters: IJewelleryFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IJewelleryResponse>> => {
  const { searchTerm, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: jewellerySearchableFields.map(field => ({
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

  const whereConditions: Prisma.JewelleryWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.jewellery.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
    include: {
      jewelleryType: true,
      carat: true,
      vendor: true,
    },
  });

  const total = await prisma.jewellery.count({
    where: whereConditions,
  });
  const totalPage = Math.ceil(total / limit);

  const totalAmount = await prisma.jewellery.aggregate({
    where: whereConditions,
    _sum: {
      weight: true,
      price: true,
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
const getSingle = async (id: string): Promise<Jewellery | null> => {
  const result = await prisma.jewellery.findFirst({
    where: {
      id,
    },
    include: {
      jewelleryType: true,
      carat: true,
      vendor: true,
    },
  });

  return result;
};

// update
const updateSingle = async (
  id: string,
  payload: Partial<Jewellery>
): Promise<Jewellery | null> => {
  // check is exist
  const isExist = await prisma.jewellery.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.jewellery.update({
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
const deleteFromDB = async (id: string): Promise<Jewellery | null> => {
  // check is exist
  const isExist = await prisma.jewellery.findFirst({
    where: {
      id,
    },
    include: {
      soldJewelleries: true,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  if (isExist.isSold) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      '!!Forbidden, This Item is Sold'
    );
  }

  if (isExist.soldJewelleries?.length) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Engaged with ${isExist.soldJewelleries?.length} Docs`
    );
  }

  const result = await prisma.jewellery.delete({
    where: {
      id,
    },
  });

  return result;
};

export const JewelleryService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
