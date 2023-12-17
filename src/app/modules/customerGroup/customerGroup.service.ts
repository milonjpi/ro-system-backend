import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { CustomerGroup, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { ICustomerGroupFilters } from './customerGroup.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { customerGroupSearchableFields } from './customerGroup.constant';

// create
const insertIntoDB = async (
  data: CustomerGroup
): Promise<CustomerGroup | null> => {
  const result = await prisma.customerGroup.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// get all
const getAll = async (
  filters: ICustomerGroupFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<CustomerGroup[]>> => {
  const { searchTerm } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: customerGroupSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  const whereConditions: Prisma.CustomerGroupWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.customerGroup.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
  });

  const total = await prisma.customerGroup.count({
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
const getSingle = async (id: string): Promise<CustomerGroup | null> => {
  const result = await prisma.customerGroup.findUnique({
    where: {
      id,
    },
  });

  return result;
};

// update
const updateSingle = async (
  id: string,
  payload: Partial<CustomerGroup>
): Promise<CustomerGroup | null> => {
  // check is exist
  const isExist = await prisma.customerGroup.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.customerGroup.update({
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
const deleteFromDB = async (id: string): Promise<CustomerGroup | null> => {
  // check is exist
  const isExist = await prisma.customerGroup.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.customerGroup.delete({
    where: {
      id,
    },
  });

  return result;
};

export const CustomerGroupService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
