import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { BuildingUom, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { IBuildingUomFilters } from './buildingUom.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { buildingUomSearchableFields } from './buildingUom.constant';

// create
const insertIntoDB = async (data: BuildingUom): Promise<BuildingUom | null> => {
  const result = await prisma.buildingUom.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// get all
const getAll = async (
  filters: IBuildingUomFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<BuildingUom[]>> => {
  const { searchTerm, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: buildingUomSearchableFields.map(field => ({
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

  const whereConditions: Prisma.BuildingUomWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.buildingUom.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
  });

  const total = await prisma.buildingUom.count({
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
const getSingle = async (id: string): Promise<BuildingUom | null> => {
  const result = await prisma.buildingUom.findFirst({
    where: {
      id,
    },
  });

  return result;
};

// update
const updateSingle = async (
  id: string,
  payload: Partial<BuildingUom>
): Promise<BuildingUom | null> => {
  // check is exist
  const isExist = await prisma.buildingUom.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.buildingUom.update({
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
const deleteFromDB = async (id: string): Promise<BuildingUom | null> => {
  // check is exist
  const isExist = await prisma.buildingUom.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.buildingUom.delete({
    where: {
      id,
    },
  });

  return result;
};

export const BuildingUomService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
