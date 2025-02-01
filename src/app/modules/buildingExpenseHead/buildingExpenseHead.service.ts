import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { BuildingExpenseHead, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { IBuildingExpenseHeadFilters } from './buildingExpenseHead.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { buildingExpenseHeadSearchableFields } from './buildingExpenseHead.constant';

// create
const insertIntoDB = async (
  data: BuildingExpenseHead
): Promise<BuildingExpenseHead | null> => {
  const result = await prisma.buildingExpenseHead.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// get all
const getAll = async (
  filters: IBuildingExpenseHeadFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<BuildingExpenseHead[]>> => {
  const { searchTerm, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: buildingExpenseHeadSearchableFields.map(field => ({
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

  const whereConditions: Prisma.BuildingExpenseHeadWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.buildingExpenseHead.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
  });

  const total = await prisma.buildingExpenseHead.count({
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
const getSingle = async (id: string): Promise<BuildingExpenseHead | null> => {
  const result = await prisma.buildingExpenseHead.findFirst({
    where: {
      id,
    },
  });

  return result;
};

// update
const updateSingle = async (
  id: string,
  payload: Partial<BuildingExpenseHead>
): Promise<BuildingExpenseHead | null> => {
  // check is exist
  const isExist = await prisma.buildingExpenseHead.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.buildingExpenseHead.update({
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
): Promise<BuildingExpenseHead | null> => {
  // check is exist
  const isExist = await prisma.buildingExpenseHead.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.buildingExpenseHead.delete({
    where: {
      id,
    },
  });

  return result;
};

export const BuildingExpenseHeadService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
