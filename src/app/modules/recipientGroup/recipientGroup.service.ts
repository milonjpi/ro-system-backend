import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { RecipientGroup, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { IRecipientGroupFilters } from './recipientGroup.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { recipientGroupSearchableFields } from './recipientGroup.constant';

// create
const insertIntoDB = async (
  data: RecipientGroup
): Promise<RecipientGroup | null> => {
  const result = await prisma.recipientGroup.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// get all
const getAll = async (
  filters: IRecipientGroupFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<RecipientGroup[]>> => {
  const { searchTerm } = filters;
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: recipientGroupSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  const whereConditions: Prisma.RecipientGroupWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.recipientGroup.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      label: 'asc',
    },
  });

  const total = await prisma.recipientGroup.count({
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
const getSingle = async (id: string): Promise<RecipientGroup | null> => {
  const result = await prisma.recipientGroup.findFirst({
    where: {
      id,
    },
  });

  return result;
};

// update
const updateSingle = async (
  id: string,
  payload: Partial<RecipientGroup>
): Promise<RecipientGroup | null> => {
  // check is exist
  const isExist = await prisma.recipientGroup.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.recipientGroup.update({
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
const deleteFromDB = async (id: string): Promise<RecipientGroup | null> => {
  // check is exist
  const isExist = await prisma.recipientGroup.findFirst({
    where: {
      id,
    },
    include: {
      _count: { select: { recipients: true } },
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  if (isExist._count?.recipients) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `!!Forbidden, Engaged with ${isExist._count?.recipients} Docs`
    );
  }

  const result = await prisma.recipientGroup.delete({
    where: {
      id,
    },
  });

  return result;
};

export const RecipientGroupService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
