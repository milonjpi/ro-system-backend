import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { Vehicle, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { IVehicleFilters } from './vehicle.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { vehicleSearchableFields } from './vehicle.constant';

// create
const insertIntoDB = async (data: Vehicle): Promise<Vehicle | null> => {
  const result = await prisma.vehicle.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// get all
const getAll = async (
  filters: IVehicleFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Vehicle[]>> => {
  const { searchTerm, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: vehicleSearchableFields.map(field => ({
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

  const whereConditions: Prisma.VehicleWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.vehicle.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
  });

  const total = await prisma.vehicle.count({
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
const getSingle = async (id: string): Promise<Vehicle | null> => {
  const result = await prisma.vehicle.findFirst({
    where: {
      id,
    },
  });

  return result;
};

// update
const updateSingle = async (
  id: string,
  payload: Partial<Vehicle>
): Promise<Vehicle | null> => {
  // check is exist
  const isExist = await prisma.vehicle.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.vehicle.update({
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
const deleteFromDB = async (id: string): Promise<Vehicle | null> => {
  // check is exist
  const isExist = await prisma.vehicle.findFirst({
    where: {
      id,
    },
    include: {
      monthlyExpenses: true,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  if (isExist.monthlyExpenses?.length) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `${isExist.monthlyExpenses?.length} Documents Engaged with this`
    );
  }

  const result = await prisma.vehicle.delete({
    where: {
      id,
    },
  });

  return result;
};

export const VehicleService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
