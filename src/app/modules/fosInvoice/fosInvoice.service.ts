import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { FosInvoice, FosInvoicedProduct, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import {
  IFosInvoiceFilters,
  IFosInvoiceResponse,
  IFosSummaryFilters,
  IFosSummaryReport,
} from './fosInvoice.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { fosInvoiceSearchableFields } from './fosInvoice.constant';
import { generateFosInvoiceNo } from './fosInvoice.utils';
import moment from 'moment';

// create
const insertIntoDB = async (
  data: FosInvoice,
  fosInvoicedProducts: FosInvoicedProduct[]
): Promise<FosInvoice | null> => {
  // generate fosInvoice no
  const convertDate = moment(data.date).format('YYYYMMDD');
  const invoiceNo = await generateFosInvoiceNo(convertDate);

  // set fosInvoice no
  data.invoiceNo = invoiceNo;

  const result = await prisma.fosInvoice.create({
    data: { ...data, fosInvoicedProducts: { create: fosInvoicedProducts } },
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// get all
const getAll = async (
  filters: IFosInvoiceFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IFosInvoiceResponse>> => {
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
      OR: fosInvoiceSearchableFields.map(field => ({
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

  const whereConditions: Prisma.FosInvoiceWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.fosInvoice.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
    include: {
      fosCustomer: true,
      fosInvoicedProducts: {
        include: {
          fosProduct: true,
        },
      },
    },
  });

  const total = await prisma.fosInvoice.count({
    where: whereConditions,
  });
  const totalPage = Math.ceil(total / limit);

  const totalCount = await prisma.fosInvoice.aggregate({
    where: whereConditions,
    _sum: {
      totalQty: true,
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
const getSingle = async (id: string): Promise<FosInvoice | null> => {
  const result = await prisma.fosInvoice.findFirst({
    where: {
      id,
    },
  });

  return result;
};

// update
const updateSingle = async (
  id: string,
  payload: Partial<FosInvoice>,
  fosInvoicedProducts: FosInvoicedProduct[]
): Promise<FosInvoice | null> => {
  // check is exist
  const isExist = await prisma.fosInvoice.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  // generate fosInvoice no
  const convertDate = moment(payload.date).format('YYYYMMDD');
  if (!payload.invoiceNo?.includes(convertDate)) {
    const invoiceNo = await generateFosInvoiceNo(convertDate);

    // set Invoice no
    payload.invoiceNo = invoiceNo;
  }

  const result = await prisma.$transaction(async trans => {
    await trans.fosInvoice.update({
      where: {
        id,
      },
      data: {
        fosInvoicedProducts: {
          deleteMany: {},
        },
      },
    });

    return await trans.fosInvoice.update({
      where: {
        id,
      },
      data: {
        ...payload,
        fosInvoicedProducts: {
          create: fosInvoicedProducts,
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
const deleteFromDB = async (id: string): Promise<FosInvoice | null> => {
  // check is exist
  const isExist = await prisma.fosInvoice.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.$transaction(async trans => {
    await trans.fosInvoice.update({
      where: {
        id,
      },
      data: {
        fosInvoicedProducts: {
          deleteMany: {},
        },
      },
    });

    return await trans.fosInvoice.delete({
      where: {
        id,
      },
    });
  });

  return result;
};

// summary
const summary = async (
  filters: IFosSummaryFilters
): Promise<IFosSummaryReport[]> => {
  const { startDate, endDate } = filters;

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
  const whereConditions: Prisma.FosInvoiceWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};
  // find invoices
  const invoices = await prisma.fosInvoice.groupBy({
    where: whereConditions,
    by: ['fosCustomerId'],
    _sum: {
      totalQty: true,
    },
  });

  // customers
  const customers = await prisma.fosCustomer.findMany();

  // set voucher and invoices in customer
  const result = invoices
    .map(el => {
      const findCustomer = customers?.find(cm => cm.id === el.fosCustomerId);

      return {
        ...findCustomer,
        quantity: el?._sum?.totalQty || 0,
      };
    })
    .sort((a, b) => b.quantity - a.quantity);

  return result;
};

export const FosInvoiceService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
  summary,
};
