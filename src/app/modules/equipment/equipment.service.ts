import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { Equipment, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { IEquipmentFilters, IEquipmentResponse } from './equipment.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { equipmentSearchableFields } from './equipment.constant';
import { generateEquipmentCode } from './equipment.utils';
import { totalSum } from '../../../shared/utils';

// create
const insertIntoDB = async (data: Equipment): Promise<Equipment | null> => {
  // generate equipment id
  const equipmentCode = await generateEquipmentCode();

  // set equipment id
  data.equipmentCode = equipmentCode;
  const result = await prisma.equipment.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// get all
const getAll = async (
  filters: IEquipmentFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Equipment[]>> => {
  const { searchTerm, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: equipmentSearchableFields.map(field => ({
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

  const whereConditions: Prisma.EquipmentWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.equipment.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
  });

  const total = await prisma.equipment.count({
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
const getSingle = async (id: string): Promise<Equipment | null> => {
  const result = await prisma.equipment.findFirst({
    where: {
      id,
    },
  });

  return result;
};

// update
const updateSingle = async (
  id: string,
  payload: Partial<Equipment>
): Promise<Equipment | null> => {
  // check is exist
  const isExist = await prisma.equipment.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.equipment.update({
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
const deleteFromDB = async (id: string): Promise<Equipment | null> => {
  // check is exist
  const isExist = await prisma.equipment.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.equipment.delete({
    where: {
      id,
    },
  });

  return result;
};

// get equipment summary
const getEquipmentSummary = async (): Promise<IEquipmentResponse[]> => {
  const allEquipment = await prisma.equipment.findMany({
    where: {
      isAsset: false,
    },
    include: {
      equipmentIns: {
        select: {
          quantity: true,
          unitPrice: true,
          totalPrice: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      equipmentOuts: {
        select: {
          quantity: true,
        },
      },
    },
    orderBy: {
      label: 'asc',
    },
  });

  const result = allEquipment.map(el => ({
    id: el.id,
    equipmentCode: el.equipmentCode,
    label: el.label,
    uom: el.uom,
    isAsset: el.isAsset,
    totalQty: totalSum(el.equipmentIns || [], 'quantity'),
    unitPrice: el.equipmentIns?.length ? el.equipmentIns[0].unitPrice : 0,
    totalPrice: totalSum(el.equipmentIns || [], 'totalPrice'),
    usedQty: totalSum(el.equipmentOuts || [], 'quantity'),
  }));

  return result;
};

export const EquipmentService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
  getEquipmentSummary,
};
