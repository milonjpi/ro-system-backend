import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { Bill, BillEquipment, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { IBillFilters, IBillResponse } from './bill.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { billSearchableFields } from './bill.constant';
import { generateBillNo } from './bill.utils';

// create
const insertIntoDB = async (
  data: Bill,
  billEquipments: BillEquipment[]
): Promise<Bill | null> => {
  // generate bill no
  const billNo = await generateBillNo();

  // set bill no
  data.billNo = billNo;

  // set account head
  const findAccountHead = await prisma.accountHead.findFirst({
    where: { label: 'Purchase' },
  });

  if (!findAccountHead) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Account Head Missing');
  }
  data.accountHeadId = findAccountHead.id;

  const result = await prisma.bill.create({
    data: { ...data, billEquipments: { create: billEquipments } },
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// get all
const getAll = async (
  filters: IBillFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IBillResponse>> => {
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
      OR: billSearchableFields.map(field => ({
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

  const whereConditions: Prisma.BillWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.bill.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
    include: {
      vendor: true,
      billEquipments: {
        include: {
          equipment: true,
        },
      },
    },
  });

  const total = await prisma.bill.count({
    where: whereConditions,
  });
  const totalPage = Math.ceil(total / limit);

  const totalAmount = await prisma.bill.aggregate({
    where: whereConditions,
    _sum: {
      totalPrice: true,
      discount: true,
      amount: true,
      paidAmount: true,
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
const getSingle = async (id: string): Promise<Bill | null> => {
  const result = await prisma.bill.findUnique({
    where: {
      id,
    },
  });

  return result;
};

// update
const updateSingle = async (
  id: string,
  payload: Partial<Bill>,
  billEquipments: BillEquipment[]
): Promise<Bill | null> => {
  // check is exist
  const isExist = await prisma.bill.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  if (isExist.status === 'Canceled') {
    throw new ApiError(httpStatus.NOT_FOUND, 'You cant Update after Canceled');
  }

  if (isExist.status === 'Paid') {
    throw new ApiError(httpStatus.NOT_FOUND, 'You cant Update after Paid');
  }

  const result = await prisma.$transaction(async trans => {
    await trans.bill.update({
      where: {
        id,
      },
      data: {
        billEquipments: {
          deleteMany: {},
        },
      },
    });

    return await trans.bill.update({
      where: {
        id,
      },
      data: {
        ...payload,
        billEquipments: {
          create: billEquipments,
        },
      },
    });
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Update');
  }

  return result;
};

// delete
const deleteFromDB = async (id: string): Promise<Bill | null> => {
  // check is exist
  const isExist = await prisma.bill.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  if (isExist.status === 'Paid' || isExist.status === 'Partial') {
    throw new ApiError(httpStatus.NOT_FOUND, 'You cant delete after Paid');
  }

  const result = await prisma.$transaction(async trans => {
    await trans.bill.update({
      where: {
        id,
      },
      data: {
        billEquipments: {
          deleteMany: {},
        },
      },
    });

    return await trans.bill.delete({
      where: {
        id,
      },
    });
  });

  return result;
};

export const BillService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
