import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { EquipmentOut, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { IEquipmentOutFilters } from './equipmentOut.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { equipmentOutSearchableFields } from './equipmentOut.constant';

// create
const insertIntoDB = async (
  data: EquipmentOut
): Promise<EquipmentOut | null> => {
  const result = await prisma.equipmentOut.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// get all
const getAll = async (
  filters: IEquipmentOutFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<EquipmentOut[]>> => {
  const { searchTerm, startDate, endDate, ...filterData } = filters;
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

  if (searchTerm) {
    andConditions.push({
      OR: equipmentOutSearchableFields.map(field => ({
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
        [field]: value,
      })),
    });
  }

  const whereConditions: Prisma.EquipmentOutWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.equipmentOut.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
    include: {
      equipment: true,
    },
  });

  const total = await prisma.equipmentOut.count({
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
const getSingle = async (id: string): Promise<EquipmentOut | null> => {
  const result = await prisma.equipmentOut.findUnique({
    where: {
      id,
    },
    include: {
      equipment: true,
    },
  });

  return result;
};

// update
const updateSingle = async (
  id: string,
  payload: Partial<EquipmentOut>
): Promise<EquipmentOut | null> => {
  // check is exist
  const isExist = await prisma.equipmentOut.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.equipmentOut.update({
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
const deleteFromDB = async (id: string): Promise<EquipmentOut | null> => {
  // check is exist
  const isExist = await prisma.equipmentOut.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.equipmentOut.delete({
    where: {
      id,
    },
  });

  return result;
};

export const EquipmentOutService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
