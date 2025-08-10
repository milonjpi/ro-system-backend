import httpStatus from 'http-status';
import { SoldJewellery, Prisma, JewelleryCategory } from '@prisma/client';
import {
  ISoldJewelleryFilters,
  ISoldJewelleryResponse,
} from './soldJewellery.interface';
import prisma from '../../../shared/prisma';
import ApiError from '../../../errors/ApiError';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { soldJewellerySearchableFields } from './soldJewellery.constant';

// create
const insertIntoDB = async (data: SoldJewellery): Promise<string | null> => {
  const result = await prisma.$transaction(async trans => {
    const createSoldData = await trans.soldJewellery.create({ data });

    await trans.jewellery.update({
      where: { id: data.jewelleryId },
      data: { isSold: true, soldDate: data?.soldDate },
    });

    return createSoldData;
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return 'success';
};

// get all
const getAll = async (
  filters: ISoldJewelleryFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<ISoldJewelleryResponse>> => {
  const { searchTerm, category, jewelleryTypeId, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: soldJewellerySearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (category) {
    andConditions.push({
      jewellery: { category: category as JewelleryCategory },
    });
  }

  if (jewelleryTypeId) {
    andConditions.push({
      jewellery: { jewelleryTypeId },
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.entries(filterData).map(([field, value]) => ({
        [field]: value === 'true' ? true : value === 'false' ? false : value,
      })),
    });
  }

  const whereConditions: Prisma.SoldJewelleryWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.soldJewellery.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
    include: {
      jewellery: {
        include: { jewelleryType: true, carat: true, vendor: true },
      },
      vendor: true,
    },
  });

  const total = await prisma.soldJewellery.count({
    where: whereConditions,
  });
  const totalPage = Math.ceil(total / limit);

  const totalAmount = await prisma.soldJewellery.aggregate({
    where: whereConditions,
    _sum: {
      weight: true,
      price: true,
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
const getSingle = async (id: string): Promise<SoldJewellery | null> => {
  const result = await prisma.soldJewellery.findFirst({
    where: {
      id,
    },
    include: {
      jewellery: {
        include: { jewelleryType: true, carat: true, vendor: true },
      },
      vendor: true,
    },
  });

  return result;
};

// update
const updateSingle = async (
  id: string,
  payload: Partial<SoldJewellery>
): Promise<SoldJewellery | null> => {
  // check is exist
  const isExist = await prisma.soldJewellery.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.$transaction(async trans => {
    await trans.jewellery.update({
      where: { id: isExist.jewelleryId },
      data: { isSold: false, soldDate: null },
    });

    const updateSoldData = await trans.soldJewellery.update({
      where: {
        id,
      },
      data: payload,
    });

    await trans.jewellery.update({
      where: { id: updateSoldData.jewelleryId },
      data: { isSold: true, soldDate: updateSoldData?.soldDate },
    });

    return updateSoldData;
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Update');
  }

  return result;
};

// delete
const deleteFromDB = async (id: string): Promise<SoldJewellery | null> => {
  // check is exist
  const isExist = await prisma.soldJewellery.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.$transaction(async trans => {
    await trans.jewellery.update({
      where: { id: isExist.jewelleryId },
      data: { isSold: false, soldDate: null },
    });

    return await trans.soldJewellery.delete({ where: { id } });
  });

  return result;
};

export const SoldJewelleryService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
