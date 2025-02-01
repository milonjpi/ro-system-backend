import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { BuildingBrand, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { IBuildingBrandFilters } from './buildingBrand.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { buildingBrandSearchableFields } from './buildingBrand.constant';

// create
const insertIntoDB = async (
  data: BuildingBrand
): Promise<BuildingBrand | null> => {
  const result = await prisma.buildingBrand.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// get all
const getAll = async (
  filters: IBuildingBrandFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<BuildingBrand[]>> => {
  const { searchTerm, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: buildingBrandSearchableFields.map(field => ({
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

  const whereConditions: Prisma.BuildingBrandWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.buildingBrand.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
  });

  const total = await prisma.buildingBrand.count({
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
const getSingle = async (id: string): Promise<BuildingBrand | null> => {
  const result = await prisma.buildingBrand.findFirst({
    where: {
      id,
    },
  });

  return result;
};

// update
const updateSingle = async (
  id: string,
  payload: Partial<BuildingBrand>
): Promise<BuildingBrand | null> => {
  // check is exist
  const isExist = await prisma.buildingBrand.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.buildingBrand.update({
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
const deleteFromDB = async (id: string): Promise<BuildingBrand | null> => {
  // check is exist
  const isExist = await prisma.buildingBrand.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.buildingBrand.delete({
    where: {
      id,
    },
  });

  return result;
};

export const BuildingBrandService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
