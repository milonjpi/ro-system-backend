import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { BuildingPayment, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { IBuildingPaymentFilters } from './buildingPayment.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';

// create
const insertIntoDB = async (
  data: BuildingPayment
): Promise<BuildingPayment | null> => {
  const result = await prisma.buildingPayment.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// get all
const getAll = async (
  filters: IBuildingPaymentFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<BuildingPayment[]>> => {
  const { startDate, endDate, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (startDate) {
    andConditions.push({
      date: {
        gte: new Date(`${startDate}, 00:00:00`),
      },
    });
  }
  if (endDate) {
    andConditions.push({
      date: {
        lte: new Date(`${endDate}, 23:59:59`),
      },
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.entries(filterData).map(([field, value]) => ({
        [field]: value === 'true' ? true : value === 'false' ? false : value,
      })),
    });
  }

  const whereConditions: Prisma.BuildingPaymentWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.buildingPayment.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
    include: {
      expense: true,
      paymentMethod: true,
    },
  });

  const total = await prisma.buildingPayment.count({
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
const getSingle = async (id: string): Promise<BuildingPayment | null> => {
  const result = await prisma.buildingPayment.findFirst({
    where: {
      id,
    },
    include: {
      expense: true,
      paymentMethod: true,
    },
  });

  return result;
};

// update
const updateSingle = async (
  id: string,
  payload: Partial<BuildingPayment>
): Promise<BuildingPayment | null> => {
  // check is exist
  const isExist = await prisma.buildingPayment.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.buildingPayment.update({
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
const deleteFromDB = async (id: string): Promise<BuildingPayment | null> => {
  // check is exist
  const isExist = await prisma.buildingPayment.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.buildingPayment.delete({
    where: {
      id,
    },
  });

  return result;
};

export const BuildingPaymentService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
