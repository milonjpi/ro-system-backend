import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { FosProduct, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { IFosProductFilters } from './fosProduct.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { fosProductSearchableFields } from './fosProduct.constant';
import { generateFosProductId } from './fosProduct.utils';

// create
const insertIntoDB = async (data: FosProduct): Promise<FosProduct | null> => {
  // generate fosProduct id
  const productId = await generateFosProductId();

  // set fosProduct id
  data.productId = productId;

  const result = await prisma.fosProduct.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// get all
const getAll = async (
  filters: IFosProductFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<FosProduct[]>> => {
  const { searchTerm, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: fosProductSearchableFields.map(field => ({
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

  const whereConditions: Prisma.FosProductWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.fosProduct.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
  });

  const total = await prisma.fosProduct.count({
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
const getSingle = async (id: string): Promise<FosProduct | null> => {
  const result = await prisma.fosProduct.findFirst({
    where: {
      id,
    },
  });

  return result;
};

// update
const updateSingle = async (
  id: string,
  payload: Partial<FosProduct>
): Promise<FosProduct | null> => {
  // check is exist
  const isExist = await prisma.fosProduct.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.fosProduct.update({
    where: { id },
    data: payload,
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Update');
  }

  return result;
};

// delete
const deleteFromDB = async (id: string): Promise<FosProduct | null> => {
  // check is exist
  const isExist = await prisma.fosProduct.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.fosProduct.delete({
    where: {
      id,
    },
  });

  return result;
};

export const FosProductService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
