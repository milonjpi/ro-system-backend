import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { BuildingInvestment, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import {
  IBuildingInvestmentFilters,
  IBuildingInvestmentResponse,
} from './buildingInvestment.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { buildingInvestmentSearchableFields } from './buildingInvestment.constant';

// create
const insertIntoDB = async (
  data: BuildingInvestment
): Promise<BuildingInvestment | null> => {
  const result = await prisma.buildingInvestment.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// get all
const getAll = async (
  filters: IBuildingInvestmentFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IBuildingInvestmentResponse>> => {
  const { searchTerm, startDate, endDate, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: buildingInvestmentSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

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

  const whereConditions: Prisma.BuildingInvestmentWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.buildingInvestment.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
    include: {
      investmentSource: true,
    },
  });

  const total = await prisma.buildingInvestment.count({
    where: whereConditions,
  });
  const totalPage = Math.ceil(total / limit);

  const totalAmount = await prisma.buildingInvestment.aggregate({
    where: whereConditions,
    _sum: {
      amount: true,
    },
  });

  return {
    meta: {
      page,
      limit,
      total,
      totalPage,
    },
    data: {
      data: result,
      sum: totalAmount,
    },
  };
};

// get single
const getSingle = async (id: string): Promise<BuildingInvestment | null> => {
  const result = await prisma.buildingInvestment.findFirst({
    where: {
      id,
    },
    include: {
      investmentSource: true,
    },
  });

  return result;
};

// update
const updateSingle = async (
  id: string,
  payload: Partial<BuildingInvestment>
): Promise<BuildingInvestment | null> => {
  // check is exist
  const isExist = await prisma.buildingInvestment.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.buildingInvestment.update({
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
const deleteFromDB = async (id: string): Promise<BuildingInvestment | null> => {
  // check is exist
  const isExist = await prisma.buildingInvestment.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.buildingInvestment.delete({
    where: {
      id,
    },
  });

  return result;
};

export const BuildingInvestmentService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
