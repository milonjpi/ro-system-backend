import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { BuildingPaymentMethod, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { IBuildingPaymentMethodFilters } from './buildingPaymentMethod.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { buildingPaymentMethodSearchableFields } from './buildingPaymentMethod.constant';

// create
const insertIntoDB = async (
  data: BuildingPaymentMethod
): Promise<BuildingPaymentMethod | null> => {
  const result = await prisma.buildingPaymentMethod.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// get all
const getAll = async (
  filters: IBuildingPaymentMethodFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<BuildingPaymentMethod[]>> => {
  const { searchTerm, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: buildingPaymentMethodSearchableFields.map(field => ({
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

  const whereConditions: Prisma.BuildingPaymentMethodWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.buildingPaymentMethod.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
  });

  const total = await prisma.buildingPaymentMethod.count({
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
const getSingle = async (id: string): Promise<BuildingPaymentMethod | null> => {
  const result = await prisma.buildingPaymentMethod.findFirst({
    where: {
      id,
    },
  });

  return result;
};

// update
const updateSingle = async (
  id: string,
  payload: Partial<BuildingPaymentMethod>
): Promise<BuildingPaymentMethod | null> => {
  // check is exist
  const isExist = await prisma.buildingPaymentMethod.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.buildingPaymentMethod.update({
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
const deleteFromDB = async (
  id: string
): Promise<BuildingPaymentMethod | null> => {
  // check is exist
  const isExist = await prisma.buildingPaymentMethod.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.buildingPaymentMethod.delete({
    where: {
      id,
    },
  });

  return result;
};

export const BuildingPaymentMethodService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
