import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { FosCustomer, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { IFosCustomerFilters } from './fosCustomer.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { fosCustomerSearchableFields } from './fosCustomer.constant';
import { generateFosCustomerId } from './fosCustomer.utils';

// create
const insertIntoDB = async (data: FosCustomer): Promise<FosCustomer | null> => {
  // generate fosCustomer id
  const customerId = await generateFosCustomerId();

  // set fosCustomer id
  data.customerId = customerId;

  const result = await prisma.fosCustomer.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// create
const insertIntoDBAll = async (data: FosCustomer[]): Promise<string | null> => {
  const result = await prisma.fosCustomer.createMany({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return 'result';
};

// get all
const getAll = async (
  filters: IFosCustomerFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<FosCustomer[]>> => {
  const { searchTerm, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: fosCustomerSearchableFields.map(field => ({
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

  const whereConditions: Prisma.FosCustomerWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.fosCustomer.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
  });

  const total = await prisma.fosCustomer.count({
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
const getSingle = async (id: string): Promise<FosCustomer | null> => {
  const result = await prisma.fosCustomer.findFirst({
    where: {
      id,
    },
  });

  return result;
};

// update
const updateSingle = async (
  id: string,
  payload: Partial<FosCustomer>
): Promise<FosCustomer | null> => {
  // check is exist
  const isExist = await prisma.fosCustomer.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.fosCustomer.update({
    where: { id },
    data: payload,
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Update');
  }

  return result;
};

// delete
const deleteFromDB = async (id: string): Promise<FosCustomer | null> => {
  // check is exist
  const isExist = await prisma.fosCustomer.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.fosCustomer.delete({
    where: {
      id,
    },
  });

  return result;
};

export const FosCustomerService = {
  insertIntoDB,
  insertIntoDBAll,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
