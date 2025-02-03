import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { BuildingInvestmentSource, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { IBuildingInvestmentSourceFilters } from './buildingInvestmentSource.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { buildingInvestmentSourceSearchableFields } from './buildingInvestmentSource.constant';

// create
const insertIntoDB = async (
  data: BuildingInvestmentSource
): Promise<BuildingInvestmentSource | null> => {
  const result = await prisma.buildingInvestmentSource.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// get all
const getAll = async (
  filters: IBuildingInvestmentSourceFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<BuildingInvestmentSource[]>> => {
  const { searchTerm, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: buildingInvestmentSourceSearchableFields.map(field => ({
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

  const whereConditions: Prisma.BuildingInvestmentSourceWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.buildingInvestmentSource.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
  });

  const total = await prisma.buildingInvestmentSource.count({
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
const getSingle = async (
  id: string
): Promise<BuildingInvestmentSource | null> => {
  const result = await prisma.buildingInvestmentSource.findFirst({
    where: {
      id,
    },
  });

  return result;
};

// update
const updateSingle = async (
  id: string,
  payload: Partial<BuildingInvestmentSource>
): Promise<BuildingInvestmentSource | null> => {
  // check is exist
  const isExist = await prisma.buildingInvestmentSource.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.buildingInvestmentSource.update({
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
): Promise<BuildingInvestmentSource | null> => {
  // check is exist
  const isExist = await prisma.buildingInvestmentSource.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.buildingInvestmentSource.delete({
    where: {
      id,
    },
  });

  return result;
};

export const BuildingInvestmentSourceService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
