import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { DistVendor, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { IDistVendorFilters } from './distVendor.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { distVendorSearchableFields } from './distVendor.constant';
import { generateDistVendorId } from './distVendor.utils';

// create
const insertIntoDB = async (data: DistVendor): Promise<DistVendor | null> => {
  // generate Vendor id
  const vendorId = await generateDistVendorId();

  // set Vendor id
  data.vendorId = vendorId;
  const result = await prisma.distVendor.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// get all
const getAll = async (
  filters: IDistVendorFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<DistVendor[]>> => {
  const { searchTerm, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: distVendorSearchableFields.map(field => ({
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

  const whereConditions: Prisma.DistVendorWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.distVendor.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
  });

  const total = await prisma.distVendor.count({
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
const getSingle = async (id: string): Promise<DistVendor | null> => {
  const result = await prisma.distVendor.findUnique({
    where: {
      id,
    },
  });

  return result;
};

// update
const updateSingle = async (
  id: string,
  payload: Partial<DistVendor>
): Promise<DistVendor | null> => {
  // check is exist
  const isExist = await prisma.distVendor.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.distVendor.update({
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
const deleteFromDB = async (id: string): Promise<DistVendor | null> => {
  // check is exist
  const isExist = await prisma.distVendor.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.distVendor.delete({
    where: {
      id,
    },
  });

  return result;
};

export const DistVendorService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
