import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { DistInvoice, DistInvoicedProduct, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import {
  IDistInvoiceFilters,
  IDistInvoiceResponse,
} from './distInvoice.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { distInvoiceSearchableFields } from './distInvoice.constant';
import moment from 'moment';
import { generateDistInvoiceNo } from './distInvoice.utils';

// create
const insertIntoDB = async (
  data: DistInvoice,
  distInvoicedProducts: DistInvoicedProduct[]
): Promise<DistInvoice | null> => {
  // generate distInvoice no
  const convertDate = moment(data.date).format('YYYYMMDD');
  const invoiceNo = await generateDistInvoiceNo(convertDate);

  // set distInvoice no
  data.invoiceNo = invoiceNo;

  const result = await prisma.distInvoice.create({
    data: { ...data, distInvoicedProducts: { create: distInvoicedProducts } },
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// get all
const getAll = async (
  filters: IDistInvoiceFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IDistInvoiceResponse>> => {
  const { searchTerm, startDate, endDate, distributorId, ...filterData } =
    filters;
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
      OR: distInvoiceSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (distributorId) {
    andConditions.push({ customer: { distributorId } });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.entries(filterData).map(([field, value]) => ({
        [field]: value === 'true' ? true : value === 'false' ? false : value,
      })),
    });
  }

  const whereConditions: Prisma.DistInvoiceWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.distInvoice.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
    include: {
      customer: true,
      distVoucherDetails: true,
      distInvoicedProducts: {
        include: {
          product: true,
        },
      },
    },
  });

  const total = await prisma.distInvoice.count({
    where: whereConditions,
  });
  const totalPage = Math.ceil(total / limit);

  const totalCount = await prisma.distInvoice.aggregate({
    where: whereConditions,
    _sum: {
      totalQty: true,
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
      sum: totalCount,
    },
  };
};

// get single
const getSingle = async (id: string): Promise<DistInvoice | null> => {
  const result = await prisma.distInvoice.findFirst({
    where: {
      id,
    },
  });

  return result;
};

// update
const updateSingle = async (
  id: string,
  payload: Partial<DistInvoice>,
  distInvoicedProducts: DistInvoicedProduct[]
): Promise<DistInvoice | null> => {
  // check is exist
  const isExist = await prisma.distInvoice.findFirst({
    where: {
      id,
    },
    include: {
      distVoucherDetails: true,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  if (isExist.status === 'Canceled') {
    throw new ApiError(httpStatus.NOT_FOUND, 'You cant Update after canceled');
  }

  if (isExist.distVoucherDetails?.length) {
    throw new ApiError(httpStatus.NOT_FOUND, 'You cant Update');
  }

  // generate invoice no
  const convertDate = moment(payload.date).format('YYYYMMDD');
  if (!payload.invoiceNo?.includes(convertDate)) {
    const invoiceNo = await generateDistInvoiceNo(convertDate);

    // set invoice no
    payload.invoiceNo = invoiceNo;
  }

  const result = await prisma.$transaction(async trans => {
    await trans.distInvoice.update({
      where: {
        id,
      },
      data: {
        distInvoicedProducts: {
          deleteMany: {},
        },
      },
    });

    return await trans.distInvoice.update({
      where: {
        id,
      },
      data: {
        ...payload,
        distInvoicedProducts: {
          create: distInvoicedProducts,
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
const deleteFromDB = async (id: string): Promise<DistInvoice | null> => {
  // check is exist
  const isExist = await prisma.distInvoice.findFirst({
    where: {
      id,
    },
    include: {
      distVoucherDetails: true,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  if (
    (isExist.status === 'Paid' && isExist.distVoucherDetails?.length) ||
    isExist.status === 'Partial'
  ) {
    throw new ApiError(httpStatus.NOT_FOUND, 'You cant delete after paid');
  }

  const result = await prisma.$transaction(async trans => {
    await trans.distInvoice.update({
      where: {
        id,
      },
      data: {
        distInvoicedProducts: {
          deleteMany: {},
        },
      },
    });

    return await trans.distInvoice.delete({
      where: {
        id,
      },
    });
  });

  return result;
};

export const DistInvoiceService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
