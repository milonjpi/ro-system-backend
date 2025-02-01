import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { BuildingVendor, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { IBuildingVendorFilters } from './buildingVendor.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { buildingVendorSearchableFields } from './buildingVendor.constant';

// create
const insertIntoDB = async (
  data: BuildingVendor
): Promise<BuildingVendor | null> => {
  const result = await prisma.buildingVendor.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// get all
const getAll = async (
  filters: IBuildingVendorFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<BuildingVendor[]>> => {
  const { searchTerm, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: buildingVendorSearchableFields.map(field => ({
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

  const whereConditions: Prisma.BuildingVendorWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.buildingVendor.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
  });

  const total = await prisma.buildingVendor.count({
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
const getSingle = async (id: string): Promise<BuildingVendor | null> => {
  const result = await prisma.buildingVendor.findFirst({
    where: {
      id,
    },
  });

  return result;
};

// update
const updateSingle = async (
  id: string,
  payload: Partial<BuildingVendor>
): Promise<BuildingVendor | null> => {
  // check is exist
  const isExist = await prisma.buildingVendor.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.buildingVendor.update({
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
const deleteFromDB = async (id: string): Promise<BuildingVendor | null> => {
  // check is exist
  const isExist = await prisma.buildingVendor.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.buildingVendor.delete({
    where: {
      id,
    },
  });

  return result;
};

export const BuildingVendorService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
