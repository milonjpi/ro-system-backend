import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { Recipient, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { IRecipientFilters, IRecipientResponse } from './recipient.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { recipientSearchableFields } from './recipient.constant';
import { totalSum } from '../../../shared/utils';

// create
const insertIntoDB = async (data: Recipient): Promise<Recipient | null> => {
  const result = await prisma.recipient.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// get all
const getAll = async (
  filters: IRecipientFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IRecipientResponse>> => {
  const { searchTerm, ...filterData } = filters;
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: recipientSearchableFields.map(field => ({
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

  const whereConditions: Prisma.RecipientWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.recipient.findMany({
    where: whereConditions,
    skip,
    take: limit,
    include: {
      zakats: {
        orderBy: {
          year: 'asc',
        },
      },
    },
  });
  const sortResult = result.sort((a, b) => {
    const sumA = a.zakats.reduce((acc, zakat) => acc + zakat.amount, 0);
    const sumB = b.zakats.reduce((acc, zakat) => acc + zakat.amount, 0);
    return sumB - sumA;
  });

  const total = await prisma.recipient.count({
    where: whereConditions,
  });
  const totalPage = Math.ceil(total / limit);

  const totalRecipients = await prisma.recipient.findMany({
    where: whereConditions,
    include: {
      zakats: true,
    },
  });

  const totalAmount = totalSum(
    totalRecipients?.map(el => ({ amount: totalSum(el.zakats, 'amount') })),
    'amount'
  );

  return {
    meta: {
      page,
      limit,
      total,
      totalPage,
    },
    data: {
      data: sortResult,
      sum: totalAmount,
    },
  };
};

// get single
const getSingle = async (id: string): Promise<Recipient | null> => {
  const result = await prisma.recipient.findFirst({
    where: {
      id,
    },
    include: {
      zakats: true,
    },
  });

  return result;
};

// update
const updateSingle = async (
  id: string,
  payload: Partial<Recipient>
): Promise<Recipient | null> => {
  // check is exist
  const isExist = await prisma.recipient.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.recipient.update({
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
const deleteFromDB = async (id: string): Promise<Recipient | null> => {
  // check is exist
  const isExist = await prisma.recipient.findFirst({
    where: {
      id,
    },
    include: {
      zakats: true,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  if (isExist.zakats?.length) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'You Cant Delete');
  }

  const result = await prisma.recipient.delete({
    where: {
      id,
    },
  });

  return result;
};

export const RecipientService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
