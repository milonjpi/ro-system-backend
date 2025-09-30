import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { ElectricityBill, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import {
  IBillGroupResponse,
  IElectricAllSummary,
  IElectricityBillFilters,
  IElectricityBillResponse,
  IElectricMonthSummary,
  IElectricYearSummary,
} from './electricityBill.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { electricityBillSearchableFields } from './electricityBill.constant';
import moment from 'moment';
import groupBy from 'lodash.groupby';
import { totalSum } from '../../../shared/utils';

// create
const insertIntoDB = async (
  data: ElectricityBill
): Promise<ElectricityBill | null> => {
  const result = await prisma.electricityBill.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// create many
const createMany = async (
  data: ElectricityBill[]
): Promise<Prisma.BatchPayload> => {
  const result = await prisma.electricityBill.createMany({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// get all
const getAll = async (
  filters: IElectricityBillFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IElectricityBillResponse>> => {
  const { searchTerm, smsAccount, ...filterData } = filters;
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: electricityBillSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (smsAccount) {
    andConditions.push({
      meter: { smsAccount },
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.entries(filterData).map(([field, value]) => ({
        [field]: value === 'true' ? true : value === 'false' ? false : value,
      })),
    });
  }

  const whereConditions: Prisma.ElectricityBillWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.electricityBill.findMany({
    where: whereConditions,
    orderBy: [
      {
        year: 'desc',
      },
      {
        date: 'desc',
      },
      {
        createdAt: 'desc',
      },
    ],
    skip,
    take: limit,
    include: {
      meter: true,
    },
  });

  const total = await prisma.electricityBill.count({
    where: whereConditions,
  });
  const totalPage = Math.ceil(total / limit);

  const totalAmount = await prisma.electricityBill.aggregate({
    where: whereConditions,
    _sum: {
      unit: true,
      netBill: true,
      serviceCharge: true,
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
// get all group
const getAllGroup = async (
  filters: IElectricityBillFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IBillGroupResponse>> => {
  const { searchTerm, smsAccount, ...filterData } = filters;
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: electricityBillSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (smsAccount) {
    andConditions.push({
      meter: { smsAccount },
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.entries(filterData).map(([field, value]) => ({
        [field]: value === 'true' ? true : value === 'false' ? false : value,
      })),
    });
  }

  const whereConditions: Prisma.ElectricityBillWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.electricityBill.findMany({
    where: whereConditions,
    orderBy: [{ year: 'desc' }, { date: 'desc' }, { createdAt: 'desc' }],
    include: {
      meter: true,
    },
  });

  const groupedResult = groupBy(result, el => el.year + '_' + el.month);
  const mappedResult = Object.entries(groupedResult)
    .slice(skip, skip + limit)
    .map(([item, value]) => ({
      year: item.split('_')[0],
      month: item.split('_')[1],
      code: parseInt(moment(item.split('_')[1], 'MMMM').format('MM')),
      data: value.sort((a, b) =>
        (a.meter.smsAccount || '')?.localeCompare(b.meter.smsAccount || '')
      ),
    }));

  const sortResult = mappedResult.sort(
    (a, b) => b.year.localeCompare(a.year) && b.code - a.code
  );

  const total = Object.entries(groupedResult)?.length;
  const totalPage = Math.ceil(total / limit);

  const totalAmount = await prisma.electricityBill.aggregate({
    where: whereConditions,
    _sum: {
      unit: true,
      netBill: true,
      serviceCharge: true,
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
      data: sortResult,
      sum: totalAmount,
    },
  };
};

// get single
const getSingle = async (id: string): Promise<ElectricityBill | null> => {
  const result = await prisma.electricityBill.findFirst({
    where: {
      id,
    },
    include: {
      meter: true,
    },
  });

  return result;
};

// update
const updateSingle = async (
  id: string,
  payload: Partial<ElectricityBill>
): Promise<ElectricityBill | null> => {
  // check is exist
  const isExist = await prisma.electricityBill.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.electricityBill.update({
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
const deleteFromDB = async (id: string): Promise<ElectricityBill | null> => {
  // check is exist
  const isExist = await prisma.electricityBill.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.electricityBill.delete({
    where: {
      id,
    },
  });

  return result;
};

const monthSummary = async (
  filters: IElectricityBillFilters
): Promise<IElectricMonthSummary[]> => {
  const { meterId, year } = filters;

  const andConditions = [];

  if (meterId) {
    andConditions.push({ meterId: meterId });
  }

  if (year) {
    andConditions.push({ year: year });
  }

  const whereConditions: Prisma.ElectricityBillWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.electricityBill.groupBy({
    by: ['month'],
    where: whereConditions,
    _sum: {
      unit: true,
      netBill: true,
      serviceCharge: true,
      amount: true,
    },
  });

  return result;
};

const yearSummary = async (
  filters: IElectricityBillFilters
): Promise<IElectricYearSummary[]> => {
  const { meterId } = filters;

  const andConditions = [];

  if (meterId) {
    andConditions.push({ meterId: meterId });
  }

  const whereConditions: Prisma.ElectricityBillWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.electricityBill.groupBy({
    by: ['meterId', 'year'],
    where: whereConditions,
    _sum: {
      unit: true,
      netBill: true,
      serviceCharge: true,
      amount: true,
    },
    orderBy: { year: 'asc' },
  });

  return result;
};

const allSummary = async (): Promise<IElectricAllSummary[]> => {
  const meters = await prisma.meter.findMany();
  const meterMap = Object.fromEntries(
    meters.map(m => [m.id, m.smsAccount || 'Unknown'])
  );

  const bills = await prisma.electricityBill.groupBy({
    by: ['meterId', 'year', 'month'],
    _sum: { unit: true, amount: true },
  });

  const attached = bills.map(b => ({
    meter: meterMap[b.meterId] ?? 'Unknown',
    year: b.year,
    month: b.month,
    unit: b._sum.unit || 0,
    amount: b._sum.amount || 0,
  }));

  return Object.entries(groupBy(attached, b => b.meter))
    .sort(([meterA], [meterB]) => meterA.localeCompare(meterB))
    .map(([meter, items]) => ({
      meter,
      unit: totalSum(items, 'unit'),
      amount: totalSum(items, 'amount'),
      data: Object.entries(groupBy(items, b => b.year))
        .sort(([yearA], [yearB]) => yearA.localeCompare(yearB))
        .map(([year, records]) => ({
          year,
          unit: totalSum(records, 'unit'),
          amount: totalSum(records, 'amount'),
          data: records,
        })),
    }));
};

export const ElectricityBillService = {
  insertIntoDB,
  createMany,
  getAll,
  getAllGroup,
  getSingle,
  updateSingle,
  deleteFromDB,
  monthSummary,
  yearSummary,
  allSummary,
};
