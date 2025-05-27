import httpStatus from 'http-status';
import { JewelleryUom, Prisma } from '@prisma/client';
import { IJewelleryUomFilters } from './jewelleryUom.interface';
import { jewelleryUomSearchableFields } from './jewelleryUom.constant';
import prisma from '../../../../shared/prisma';
import ApiError from '../../../../errors/ApiError';
import { IPaginationOptions } from '../../../../interfaces/pagination';
import { IGenericResponse } from '../../../../interfaces/common';
import { paginationHelpers } from '../../../../helpers/paginationHelper';

// create
const insertIntoDB = async (
  data: JewelleryUom
): Promise<JewelleryUom | null> => {
  const result = await prisma.jewelleryUom.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// get all
const getAll = async (
  filters: IJewelleryUomFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<JewelleryUom[]>> => {
  const { searchTerm, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: jewelleryUomSearchableFields.map(field => ({
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

  const whereConditions: Prisma.JewelleryUomWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.jewelleryUom.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
  });

  const total = await prisma.jewelleryUom.count({
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
const getSingle = async (id: string): Promise<JewelleryUom | null> => {
  const result = await prisma.jewelleryUom.findFirst({
    where: {
      id,
    },
  });

  return result;
};

// update
const updateSingle = async (
  id: string,
  payload: Partial<JewelleryUom>
): Promise<JewelleryUom | null> => {
  // check is exist
  const isExist = await prisma.jewelleryUom.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.jewelleryUom.update({
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
const deleteFromDB = async (id: string): Promise<JewelleryUom | null> => {
  // check is exist
  const isExist = await prisma.jewelleryUom.findFirst({
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

  const result = await prisma.jewelleryUom.delete({
    where: {
      id,
    },
  });

  return result;
};

export const JewelleryUomService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
