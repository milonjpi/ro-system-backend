import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { Customer, InvoiceBillStatus, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { ICustomerFilters } from './customer.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { customerSearchableFields } from './customer.constant';
import { generateCustomerId } from './customer.utils';

// create
const insertIntoDB = async (data: Customer): Promise<Customer | null> => {
  // generate customer id
  const customerId = await generateCustomerId();

  // set customer id
  data.customerId = customerId;
  const result = await prisma.customer.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// create
const insertIntoDBAll = async (data: Customer[]): Promise<string | null> => {
  const result = await prisma.customer.createMany({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return 'result';
};

// get all
const getAll = async (
  filters: ICustomerFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Customer[]>> => {
  const { searchTerm, forVoucher, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: customerSearchableFields.map(field => ({
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

  const whereConditions: Prisma.CustomerWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.customer.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
    include: {
      group: true,
      invoices: forVoucher
        ? {
            where: {
              status: {
                in: [InvoiceBillStatus.Due, InvoiceBillStatus.Partial],
              },
            },
          }
        : false,
    },
  });

  const total = await prisma.customer.count({
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
const getSingle = async (id: string): Promise<Customer | null> => {
  const result = await prisma.customer.findUnique({
    where: {
      id,
    },
    include: {
      group: true,
    },
  });

  return result;
};

// update
const updateSingle = async (
  id: string,
  payload: Partial<Customer>
): Promise<Customer | null> => {
  // check is exist
  const isExist = await prisma.customer.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.customer.update({
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
const deleteFromDB = async (id: string): Promise<Customer | null> => {
  // check is exist
  const isExist = await prisma.customer.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.customer.delete({
    where: {
      id,
    },
  });

  return result;
};

export const CustomerService = {
  insertIntoDB,
  insertIntoDBAll,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
