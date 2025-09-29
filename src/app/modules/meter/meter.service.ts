import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { Meter, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { IMeterFilters } from './meter.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { meterSearchableFields } from './meter.constant';
import groupBy from 'lodash.groupby';

// create
const insertIntoDB = async (data: Meter): Promise<Meter | null> => {
  const result = await prisma.meter.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// get all
const getAll = async (
  filters: IMeterFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Meter[]>> => {
  const { searchTerm, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: meterSearchableFields.map(field => ({
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

  const whereConditions: Prisma.MeterWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.meter.findMany({
    where: whereConditions,
    orderBy: [
      {
        smsAccount: 'asc',
      },
      {
        [sortBy]: sortOrder,
      },
    ],
    skip,
    take: limit,
  });

  const total = await prisma.meter.count({
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
const getSingle = async (id: string): Promise<Meter | null> => {
  const result = await prisma.meter.findFirst({
    where: {
      id,
    },
  });

  return result;
};

// get sms account
const getSmsAccount = async () => {
  const meters = await prisma.meter.findMany({
    where: { isActive: true },
    include: {
      electricityBills: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const groupedResult = groupBy(meters, 'smsAccount');

  const result = Object.values(groupedResult)
    .map(group => group[0])
    .sort((a, b) => (a.smsAccount || '').localeCompare(b.smsAccount || ''));

  return result;
};

// update
const updateSingle = async (
  id: string,
  payload: Partial<Meter>
): Promise<Meter | null> => {
  // check is exist
  const isExist = await prisma.meter.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.meter.update({ where: { id }, data: payload });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Update');
  }

  return result;
};

// delete
const deleteFromDB = async (id: string): Promise<Meter | null> => {
  // check is exist
  const isExist = await prisma.meter.findFirst({
    where: {
      id,
    },
    include: {
      electricityBills: true,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  if (isExist.electricityBills?.length) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Unable to Delete');
  }

  const result = await prisma.meter.delete({
    where: {
      id,
    },
  });

  return result;
};

export const MeterService = {
  insertIntoDB,
  getAll,
  getSmsAccount,
  getSingle,
  updateSingle,
  deleteFromDB,
};
