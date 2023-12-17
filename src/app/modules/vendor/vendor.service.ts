import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { Vendor, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { IVendorFilters } from './vendor.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { vendorSearchableFields } from './vendor.constant';
import { generateVendorId } from './vendor.utils';

// create
const insertIntoDB = async (data: Vendor): Promise<Vendor | null> => {
  // generate vendor id
  const vendorId = await generateVendorId();

  // set vendor id
  data.vendorId = vendorId;
  const result = await prisma.vendor.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// get all
const getAll = async (
  filters: IVendorFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Vendor[]>> => {
  const { searchTerm, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: vendorSearchableFields.map(field => ({
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

  const whereConditions: Prisma.VendorWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.vendor.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
  });

  const total = await prisma.vendor.count({
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
const getSingle = async (id: string): Promise<Vendor | null> => {
  const result = await prisma.vendor.findUnique({
    where: {
      id,
    },
  });

  return result;
};

// update
const updateSingle = async (
  id: string,
  payload: Partial<Vendor>
): Promise<Vendor | null> => {
  // check is exist
  const isExist = await prisma.vendor.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.vendor.update({
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
const deleteFromDB = async (id: string): Promise<Vendor | null> => {
  // check is exist
  const isExist = await prisma.vendor.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.vendor.delete({
    where: {
      id,
    },
  });

  return result;
};

export const VendorService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
