import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { DrInvoice, DrInvoicedProduct, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { IDrInvoiceFilters, IDrInvoiceResponse } from './drInvoice.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { drInvoiceSearchableFields } from './drInvoice.constant';
import { generateDrInvoiceNo } from './drInvoice.utils';
import moment from 'moment';

// create
const insertIntoDB = async (
  data: DrInvoice,
  drInvoicedProducts: DrInvoicedProduct[]
): Promise<DrInvoice | null> => {
  // generate drInvoice no
  const convertDate = moment(data.date).format('YYYYMMDD');
  const invoiceNo = await generateDrInvoiceNo(convertDate);

  // set dr Invoice no
  data.invoiceNo = invoiceNo;

  const result = await prisma.drInvoice.create({
    data: { ...data, drInvoicedProducts: { create: drInvoicedProducts } },
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// get all
const getAll = async (
  filters: IDrInvoiceFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IDrInvoiceResponse>> => {
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
      OR: drInvoiceSearchableFields.map(field => ({
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

  const whereConditions: Prisma.DrInvoiceWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.drInvoice.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
    include: {
      customer: true,
      drVoucherDetails: true,
      drInvoicedProducts: {
        include: {
          product: true,
        },
      },
    },
  });

  const total = await prisma.drInvoice.count({
    where: whereConditions,
  });
  const totalPage = Math.ceil(total / limit);

  const totalCount = await prisma.drInvoice.aggregate({
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
const getSingle = async (id: string): Promise<DrInvoice | null> => {
  const result = await prisma.drInvoice.findFirst({
    where: {
      id,
    },
  });

  return result;
};

// update
const updateSingle = async (
  id: string,
  payload: Partial<DrInvoice>,
  drInvoicedProducts: DrInvoicedProduct[]
): Promise<DrInvoice | null> => {
  // check is exist
  const isExist = await prisma.drInvoice.findFirst({
    where: {
      id,
    },
    include: {
      drVoucherDetails: true,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  if (isExist.status === 'Canceled') {
    throw new ApiError(httpStatus.NOT_FOUND, 'You cant Update after canceled');
  }

  if (isExist.drVoucherDetails?.length) {
    throw new ApiError(httpStatus.NOT_FOUND, 'You cant Update');
  }

  // generate drInvoice no
  const convertDate = moment(payload.date).format('YYYYMMDD');
  if (!isExist.invoiceNo?.includes(convertDate)) {
    const invoiceNo = await generateDrInvoiceNo(convertDate);

    // set invoice no
    payload.invoiceNo = invoiceNo;
  }

  const result = await prisma.$transaction(async trans => {
    await trans.drInvoice.update({
      where: {
        id,
      },
      data: {
        drInvoicedProducts: {
          deleteMany: {},
        },
      },
    });

    return await trans.drInvoice.update({
      where: {
        id,
      },
      data: {
        ...payload,
        drInvoicedProducts: {
          create: drInvoicedProducts,
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
const deleteFromDB = async (id: string): Promise<DrInvoice | null> => {
  // check is exist
  const isExist = await prisma.drInvoice.findFirst({
    where: {
      id,
    },
    include: {
      drVoucherDetails: true,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  if (
    (isExist.status === 'Paid' && isExist.drVoucherDetails?.length) ||
    isExist.status === 'Partial'
  ) {
    throw new ApiError(httpStatus.NOT_FOUND, 'You cant delete after paid');
  }

  const result = await prisma.$transaction(async trans => {
    await trans.drInvoice.update({
      where: {
        id,
      },
      data: {
        drInvoicedProducts: {
          deleteMany: {},
        },
      },
    });

    return await trans.drInvoice.delete({
      where: {
        id,
      },
    });
  });

  return result;
};

export const DrInvoiceService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
