import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { EquipmentIn, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { IEquipmentInFilters } from './equipmentIn.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { equipmentInSearchableFields } from './equipmentIn.constant';

// create
const insertIntoDB = async (data: EquipmentIn): Promise<EquipmentIn | null> => {
  // set account head
  const findAccountHead = await prisma.accountHead.findFirst({
    where: { label: 'Purchased Equipment' },
  });

  if (!findAccountHead) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Account Head Missing');
  }

  data.accountHeadId = findAccountHead.id;

  const result = await prisma.equipmentIn.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// get all
const getAll = async (
  filters: IEquipmentInFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<EquipmentIn[]>> => {
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
      OR: equipmentInSearchableFields.map(field => ({
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

  const whereConditions: Prisma.EquipmentInWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.equipmentIn.findMany({
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

  const total = await prisma.equipmentIn.count({
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
const getSingle = async (id: string): Promise<EquipmentIn | null> => {
  const result = await prisma.equipmentIn.findUnique({
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
  payload: Partial<EquipmentIn>
): Promise<EquipmentIn | null> => {
  // check is exist
  const isExist = await prisma.equipmentIn.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  if (isExist.quantity === isExist.usedQty) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Update not possible after use');
  }

  const result = await prisma.equipmentIn.update({
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
const deleteFromDB = async (id: string): Promise<EquipmentIn | null> => {
  // check is exist
  const isExist = await prisma.equipmentIn.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  if (isExist.quantity === isExist.usedQty) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Update not possible after use');
  }

  const result = await prisma.equipmentIn.delete({
    where: {
      id,
    },
  });

  return result;
};

export const EquipmentInService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
