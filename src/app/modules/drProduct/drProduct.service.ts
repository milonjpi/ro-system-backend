import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { DrProduct, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { IDrProductFilters } from './drProduct.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { drProductSearchableFields } from './drProduct.constant';
import { generateDrProductId } from './drProduct.utils';

// create
const insertIntoDB = async (data: DrProduct): Promise<DrProduct | null> => {
  // generate product id
  const productId = await generateDrProductId();

  // set product id
  data.productId = productId;
  const result = await prisma.drProduct.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// get all
const getAll = async (
  filters: IDrProductFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<DrProduct[]>> => {
  const { searchTerm, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: drProductSearchableFields.map(field => ({
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

  const whereConditions: Prisma.DrProductWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.drProduct.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
  });

  const total = await prisma.drProduct.count({
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
const getSingle = async (id: string): Promise<DrProduct | null> => {
  const result = await prisma.drProduct.findFirst({
    where: {
      id,
    },
  });

  return result;
};

// update
const updateSingle = async (
  id: string,
  payload: Partial<DrProduct>
): Promise<DrProduct | null> => {
  // check is exist
  const isExist = await prisma.drProduct.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.drProduct.update({
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
const deleteFromDB = async (id: string): Promise<DrProduct | null> => {
  // check is exist
  const isExist = await prisma.drProduct.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.drProduct.delete({
    where: {
      id,
    },
  });

  return result;
};

export const DrProductService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
