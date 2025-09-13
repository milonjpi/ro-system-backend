import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { ExpenseSubHead, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { IExpenseSubHeadFilters } from './expenseSubHead.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { expenseSubHeadSearchableFields } from './expenseSubHead.constant';

// create
const insertIntoDB = async (
  data: ExpenseSubHead
): Promise<ExpenseSubHead | null> => {
  const result = await prisma.expenseSubHead.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// get all
const getAll = async (
  filters: IExpenseSubHeadFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<ExpenseSubHead[]>> => {
  const { searchTerm, expenseHeadId } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: expenseSubHeadSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (expenseHeadId) {
    andConditions.push({
      expenseHeadId,
    });
  }

  const whereConditions: Prisma.ExpenseSubHeadWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.expenseSubHead.findMany({
    where: whereConditions,
    orderBy: [
      {
        expenseHead: { label: 'asc' },
      },
      {
        [sortBy]: sortOrder,
      },
    ],
    skip,
    take: limit,
    include: {
      expenseHead: true,
      _count: {
        select: {
          expenses: true,
        },
      },
    },
  });

  const total = await prisma.expenseSubHead.count({
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
const getSingle = async (id: string): Promise<ExpenseSubHead | null> => {
  const result = await prisma.expenseSubHead.findFirst({
    where: {
      id,
    },
    include: {
      expenseHead: true,
    },
  });

  return result;
};

// update
const updateSingle = async (
  id: string,
  payload: Partial<ExpenseSubHead>
): Promise<ExpenseSubHead | null> => {
  // check is exist
  const isExist = await prisma.expenseSubHead.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.expenseSubHead.update({
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
const deleteFromDB = async (id: string): Promise<ExpenseSubHead | null> => {
  // check is exist
  const isExist = await prisma.expenseSubHead.findFirst({
    where: {
      id,
    },
    include: {
      _count: {
        select: {
          expenses: true,
        },
      },
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  if (isExist._count.expenses) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `!!Forbidden, Engaged with ${isExist._count.expenses} Docs`
    );
  }

  const result = await prisma.expenseSubHead.delete({
    where: {
      id,
    },
  });

  return result;
};

export const ExpenseSubHeadService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
