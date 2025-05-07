import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { Source, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { ISourceFilters } from './source.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { sourceSearchableFields } from './source.constant';

// create
const insertIntoDB = async (data: Source): Promise<Source | null> => {
  const result = await prisma.source.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// get all
const getAll = async (
  filters: ISourceFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Source[]>> => {
  const { searchTerm, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: sourceSearchableFields.map(field => ({
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

  const whereConditions: Prisma.SourceWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.source.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
  });

  const total = await prisma.source.count({
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
const getSingle = async (id: string): Promise<Source | null> => {
  const result = await prisma.source.findFirst({
    where: {
      id,
    },
  });

  return result;
};

// update
const updateSingle = async (
  id: string,
  payload: Partial<Source>
): Promise<Source | null> => {
  // check is exist
  const isExist = await prisma.source.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.source.update({
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
const deleteFromDB = async (id: string): Promise<Source | null> => {
  // check is exist
  const isExist = await prisma.source.findFirst({
    where: {
      id,
    },
    include: {
      openingBalances: true,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  if (isExist.openingBalances?.length) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `${isExist.openingBalances?.length || 0} Documents Engaged with this`
    );
  }

  const result = await prisma.source.delete({
    where: {
      id,
    },
  });

  return result;
};

export const SourceService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
