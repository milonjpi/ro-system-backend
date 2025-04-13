import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { MonthlyExpense, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import {
  IAreaWiseDashResponse,
  IAreaWiseResponse,
  IHeadWiseDashResponse,
  IHeadWiseResponse,
  IMonthlyExpenseFilters,
  IMonthlyExpenseResponse,
  ISourceWiseResponse,
} from './monthlyExpense.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { monthlyExpenseSearchableFields } from './monthlyExpense.constant';

// create
const insertIntoDB = async (data: MonthlyExpense[]): Promise<string> => {
  const result = await prisma.monthlyExpense.createMany({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return 'Success';
};

// get all
const getAll = async (
  filters: IMonthlyExpenseFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IMonthlyExpenseResponse>> => {
  const { searchTerm, startDate, endDate, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: monthlyExpenseSearchableFields.map(field => ({
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
        [field]: value,
      })),
    });
  }

  const whereConditions: Prisma.MonthlyExpenseWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.monthlyExpense.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
    include: {
      expenseArea: true,
      vehicle: true,
      monthlyExpenseHead: true,
      expenseDetail: true,
      paymentSource: true,
    },
  });

  const total = await prisma.monthlyExpense.count({
    where: whereConditions,
  });
  const totalPage = Math.ceil(total / limit);

  const totalAmount = await prisma.monthlyExpense.aggregate({
    where: whereConditions,
    _sum: {
      amount: true,
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
const getSingle = async (id: string): Promise<MonthlyExpense | null> => {
  const result = await prisma.monthlyExpense.findFirst({
    where: {
      id,
    },
  });

  if (!result) return null;

  const detailedResult = await prisma.monthlyExpense.findFirst({
    where: { id },
    include: {
      expenseArea: true,
      vehicle: true,
      monthlyExpenseHead: true,
      expenseDetail: true,
      paymentSource: true,
    },
  });

  return detailedResult;
};

// update
const updateSingle = async (
  id: string,
  payload: Partial<MonthlyExpense>
): Promise<MonthlyExpense | null> => {
  // check is exist
  const isExist = await prisma.monthlyExpense.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.monthlyExpense.update({
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
const deleteFromDB = async (id: string): Promise<MonthlyExpense | null> => {
  // check is exist
  const isExist = await prisma.monthlyExpense.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.monthlyExpense.delete({
    where: {
      id,
    },
  });

  return result;
};

// report
// area wise report
const areaWiseReport = async (
  filters: IMonthlyExpenseFilters
): Promise<IAreaWiseResponse[]> => {
  const { year, paymentSourceId } = filters;

  const andConditions = [];

  if (year) {
    andConditions.push({
      year: year,
    });
  }

  if (paymentSourceId) {
    andConditions.push({
      paymentSourceId: paymentSourceId,
    });
  }

  const whereConditions: Prisma.MonthlyExpenseWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.monthlyExpense.groupBy({
    by: ['expenseAreaId', 'month'],
    where: whereConditions,
    _sum: {
      amount: true,
    },
  });
  const expenseAreas = await prisma.expenseArea.findMany();

  const mappedResult = result?.map(el => ({
    expenseArea: expenseAreas?.find(bl => bl.id === el.expenseAreaId),
    month: el.month,
    amount: el._sum?.amount || 0,
  }));

  const sortResult = mappedResult?.sort((a, b) => {
    const itemA = a.expenseArea?.label || '';
    const itemB = b.expenseArea?.label || '';

    return itemA.localeCompare(itemB);
  });

  return sortResult;
};

// head wise report
const headWiseReport = async (
  filters: IMonthlyExpenseFilters
): Promise<IHeadWiseResponse[]> => {
  const { year, expenseAreaId, paymentSourceId } = filters;

  const andConditions = [];

  if (year) {
    andConditions.push({
      year: year,
    });
  }

  if (expenseAreaId) {
    andConditions.push({
      expenseAreaId: expenseAreaId,
    });
  }

  if (paymentSourceId) {
    andConditions.push({
      paymentSourceId: paymentSourceId,
    });
  }

  const whereConditions: Prisma.MonthlyExpenseWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.monthlyExpense.groupBy({
    by: ['monthlyExpenseHeadId', 'month'],
    where: whereConditions,
    _sum: {
      amount: true,
    },
  });
  const expenseHeads = await prisma.monthlyExpenseHead.findMany();

  const mappedResult = result?.map(el => ({
    expenseHead: expenseHeads?.find(bl => bl.id === el.monthlyExpenseHeadId),
    month: el.month,
    amount: el._sum?.amount || 0,
  }));

  const sortResult = mappedResult?.sort((a, b) => {
    const itemA = a.expenseHead?.label || '';
    const itemB = b.expenseHead?.label || '';

    return itemA.localeCompare(itemB);
  });

  return sortResult;
};

// source wise report
const sourceWiseReport = async (
  filters: IMonthlyExpenseFilters
): Promise<ISourceWiseResponse[]> => {
  const { year, expenseAreaId, monthlyExpenseHeadId } = filters;

  const andConditions = [];

  if (year) {
    andConditions.push({
      year: year,
    });
  }

  if (expenseAreaId) {
    andConditions.push({
      expenseAreaId: expenseAreaId,
    });
  }

  if (monthlyExpenseHeadId) {
    andConditions.push({
      monthlyExpenseHeadId: monthlyExpenseHeadId,
    });
  }

  const whereConditions: Prisma.MonthlyExpenseWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.monthlyExpense.groupBy({
    by: ['paymentSourceId', 'month'],
    where: whereConditions,
    _sum: {
      amount: true,
    },
  });
  const paymentSources = await prisma.paymentSource.findMany();

  const mappedResult = result?.map(el => ({
    paymentSource: paymentSources?.find(bl => bl.id === el.paymentSourceId),
    month: el.month,
    amount: el._sum?.amount || 0,
  }));

  const sortResult = mappedResult?.sort((a, b) => {
    const itemA = a.paymentSource?.label || '';
    const itemB = b.paymentSource?.label || '';

    return itemA.localeCompare(itemB);
  });

  return sortResult;
};

// area wise dash report
const areaWiseDashReport = async (
  filters: IMonthlyExpenseFilters
): Promise<IAreaWiseDashResponse[]> => {
  const { year, month } = filters;

  const andConditions = [];

  if (year) {
    andConditions.push({
      year: year,
    });
  }

  if (month) {
    andConditions.push({
      month: month,
    });
  }

  const whereConditions: Prisma.MonthlyExpenseWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.monthlyExpense.groupBy({
    by: ['expenseAreaId'],
    where: whereConditions,
    _sum: {
      amount: true,
    },
  });
  const expenseAreas = await prisma.expenseArea.findMany();

  const mappedResult = expenseAreas?.map(el => {
    const findResult = result?.find(bl => bl.expenseAreaId === el.id);
    return {
      expenseArea: el.label,
      amount: findResult?._sum?.amount || 0,
    };
  });

  const sortResult = mappedResult?.sort((a, b) => {
    const itemA = a.expenseArea || '';
    const itemB = b.expenseArea || '';

    return itemA.localeCompare(itemB);
  });

  return sortResult;
};

// head wise dash report
const headWiseDashReport = async (
  filters: IMonthlyExpenseFilters
): Promise<IHeadWiseDashResponse[]> => {
  const { year, month, expenseAreaId } = filters;

  const andConditions = [];

  if (year) {
    andConditions.push({
      year: year,
    });
  }

  if (expenseAreaId) {
    andConditions.push({
      expenseAreaId: expenseAreaId,
    });
  }

  if (month) {
    andConditions.push({
      month: month,
    });
  }

  const whereConditions: Prisma.MonthlyExpenseWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.monthlyExpense.groupBy({
    by: ['monthlyExpenseHeadId'],
    where: whereConditions,
    _sum: {
      amount: true,
    },
  });
  const expenseHeads = await prisma.monthlyExpenseHead.findMany();

  const mappedResult = expenseHeads?.map(el => {
    const findResult = result?.find(bl => bl.monthlyExpenseHeadId === el.id);
    return {
      expenseHead: el?.label,
      amount: findResult?._sum?.amount || 0,
    };
  });

  const sortResult = mappedResult?.sort((a, b) => {
    const itemA = a.expenseHead || '';
    const itemB = b.expenseHead || '';

    return itemA.localeCompare(itemB);
  });

  return sortResult;
};

export const MonthlyExpenseService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
  areaWiseReport,
  areaWiseDashReport,
  headWiseReport,
  headWiseDashReport,
  sourceWiseReport,
};
