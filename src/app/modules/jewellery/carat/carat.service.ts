import httpStatus from 'http-status';
import { Carat, Prisma } from '@prisma/client';
import { ICaratFilters } from './carat.interface';
import { caratSearchableFields } from './carat.constant';
import prisma from '../../../../shared/prisma';
import ApiError from '../../../../errors/ApiError';
import { IPaginationOptions } from '../../../../interfaces/pagination';
import { IGenericResponse } from '../../../../interfaces/common';
import { paginationHelpers } from '../../../../helpers/paginationHelper';

// create
const insertIntoDB = async (data: Carat): Promise<Carat | null> => {
  const result = await prisma.carat.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// get all
const getAll = async (
  filters: ICaratFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Carat[]>> => {
  const { searchTerm, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: caratSearchableFields.map(field => ({
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

  const whereConditions: Prisma.CaratWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.carat.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
  });

  const total = await prisma.carat.count({
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
const getSingle = async (id: string): Promise<Carat | null> => {
  const result = await prisma.carat.findFirst({
    where: {
      id,
    },
  });

  return result;
};

// update
const updateSingle = async (
  id: string,
  payload: Partial<Carat>
): Promise<Carat | null> => {
  // check is exist
  const isExist = await prisma.carat.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.carat.update({
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
const deleteFromDB = async (id: string): Promise<Carat | null> => {
  // check is exist
  const isExist = await prisma.carat.findFirst({
    where: {
      id,
    },
    include: {
      jewelleries: true,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  if (isExist.jewelleries?.length) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Engaged with ${isExist.jewelleries?.length} Documents`
    );
  }

  const result = await prisma.carat.delete({
    where: {
      id,
    },
  });

  return result;
};

export const CaratService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
