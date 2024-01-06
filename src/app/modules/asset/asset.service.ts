import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { Asset, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { IAssetFilters } from './asset.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { assetSearchableFields } from './asset.constant';
import { generateAssetCode } from './asset.utils';

// create
const insertIntoDB = async (data: Asset): Promise<Asset | null> => {
  // generate asset code
  const assetCode = await generateAssetCode();

  // set asset code
  data.assetCode = assetCode;

  const result = await prisma.asset.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// get all
const getAll = async (
  filters: IAssetFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Asset[]>> => {
  const { searchTerm } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: assetSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  const whereConditions: Prisma.AssetWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.asset.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
  });

  const total = await prisma.asset.count({
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
const getSingle = async (id: string): Promise<Asset | null> => {
  const result = await prisma.asset.findUnique({
    where: {
      id,
    },
  });

  return result;
};

// update
const updateSingle = async (
  id: string,
  payload: Partial<Asset>
): Promise<Asset | null> => {
  // check is exist
  const isExist = await prisma.asset.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Record Not Found');
  }

  const result = await prisma.asset.update({
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
const deleteFromDB = async (id: string): Promise<Asset | null> => {
  // check is exist
  const isExist = await prisma.asset.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Record Not Found');
  }

  const result = await prisma.asset.delete({
    where: {
      id,
    },
  });

  return result;
};

export const AssetService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
