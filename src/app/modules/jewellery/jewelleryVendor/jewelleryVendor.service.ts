import httpStatus from 'http-status';
import { JewelleryVendor, Prisma } from '@prisma/client';
import { IJewelleryVendorFilters } from './jewelleryVendor.interface';
import { jewelleryVendorSearchableFields } from './jewelleryVendor.constant';
import prisma from '../../../../shared/prisma';
import ApiError from '../../../../errors/ApiError';
import { IPaginationOptions } from '../../../../interfaces/pagination';
import { IGenericResponse } from '../../../../interfaces/common';
import { paginationHelpers } from '../../../../helpers/paginationHelper';

// create
const insertIntoDB = async (
  data: JewelleryVendor
): Promise<JewelleryVendor | null> => {
  const result = await prisma.jewelleryVendor.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// get all
const getAll = async (
  filters: IJewelleryVendorFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<JewelleryVendor[]>> => {
  const { searchTerm, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: jewelleryVendorSearchableFields.map(field => ({
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

  const whereConditions: Prisma.JewelleryVendorWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.jewelleryVendor.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
  });

  const total = await prisma.jewelleryVendor.count({
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
const getSingle = async (id: string): Promise<JewelleryVendor | null> => {
  const result = await prisma.jewelleryVendor.findFirst({
    where: {
      id,
    },
  });

  return result;
};

// update
const updateSingle = async (
  id: string,
  payload: Partial<JewelleryVendor>
): Promise<JewelleryVendor | null> => {
  // check is exist
  const isExist = await prisma.jewelleryVendor.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.jewelleryVendor.update({
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
const deleteFromDB = async (id: string): Promise<JewelleryVendor | null> => {
  // check is exist
  const isExist = await prisma.jewelleryVendor.findFirst({
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

  const result = await prisma.jewelleryVendor.delete({
    where: {
      id,
    },
  });

  return result;
};

export const JewelleryVendorService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
