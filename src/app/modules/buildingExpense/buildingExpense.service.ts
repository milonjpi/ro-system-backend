import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { BuildingExpense, BuildingPayment, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import {
  IBuildingExpenseFilters,
  IBuildingExpenseResponse,
  IExpenseSummary,
} from './buildingExpense.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { buildingExpenseSearchableFields } from './buildingExpense.constant';

// create
const insertIntoDB = async (
  data: BuildingExpense,
  buildingPayments: BuildingPayment[]
): Promise<BuildingExpense | null> => {
  const result = await prisma.buildingExpense.create({
    data: { ...data, buildingPayments: { create: buildingPayments } },
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// get all
const getAll = async (
  filters: IBuildingExpenseFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IBuildingExpenseResponse>> => {
  const { searchTerm, startDate, endDate, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: buildingExpenseSearchableFields.map(field => ({
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

  const whereConditions: Prisma.BuildingExpenseWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.buildingExpense.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
    include: {
      expenseHead: true,
      vendor: true,
      brand: true,
      uom: true,
      buildingPayments: {
        include: {
          paymentMethod: true,
        },
      },
    },
  });

  const total = await prisma.buildingExpense.count({
    where: whereConditions,
  });
  const totalPage = Math.ceil(total / limit);

  const totalAmount = await prisma.buildingExpense.aggregate({
    where: whereConditions,
    _sum: {
      quantity: true,
      amount: true,
      paidAmount: true,
    },
    _avg: {
      unitPrice: true,
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
const getSingle = async (id: string): Promise<BuildingExpense | null> => {
  const result = await prisma.buildingExpense.findFirst({
    where: {
      id,
    },
    include: {
      expenseHead: true,
      vendor: true,
      brand: true,
      uom: true,
      buildingPayments: {
        include: {
          paymentMethod: true,
        },
      },
    },
  });

  return result;
};

// update
const updateSingle = async (
  id: string,
  payload: Partial<BuildingExpense>,
  buildingPayments: BuildingPayment[]
): Promise<BuildingExpense | null> => {
  // check is exist
  const isExist = await prisma.buildingExpense.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.$transaction(async trans => {
    await trans.buildingExpense.update({
      where: { id },
      data: { buildingPayments: { deleteMany: {} } },
    });

    return trans.buildingExpense.update({
      where: { id },
      data: { ...payload, buildingPayments: { create: buildingPayments } },
    });
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Update');
  }

  return result;
};

// delete
const deleteFromDB = async (id: string): Promise<BuildingExpense | null> => {
  // check is exist
  const isExist = await prisma.buildingExpense.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.$transaction(async trans => {
    await trans.buildingExpense.update({
      where: { id },
      data: { buildingPayments: { deleteMany: {} } },
    });

    return await trans.buildingExpense.delete({ where: { id } });
  });

  return result;
};

// get expense summary
const getExpenseSummary = async (
  filters: IBuildingExpenseFilters
): Promise<IExpenseSummary[]> => {
  const { searchTerm, startDate, endDate, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: buildingExpenseSearchableFields.map(field => ({
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

  const whereConditions: Prisma.BuildingExpenseWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const expenseSummary = await prisma.buildingExpense.groupBy({
    where: whereConditions,
    by: ['expenseHeadId'],
    _sum: {
      amount: true,
      quantity: true,
      paidAmount: true,
    },
    _avg: {
      unitPrice: true,
    },
  });
  const expenseHeads = await prisma.buildingExpenseHead.findMany();

  const combinedExpenses = expenseSummary
    ?.map(el => ({
      ...el,
      expenseHead: expenseHeads.find(bl => bl.id === el.expenseHeadId),
    }))
    .sort((a, b) => {
      const itemA = a.expenseHead?.label || '';
      const itemB = b.expenseHead?.label || '';
      return itemA.localeCompare(itemB);
    });

  return combinedExpenses;
};

export const BuildingExpenseService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
  getExpenseSummary,
};
