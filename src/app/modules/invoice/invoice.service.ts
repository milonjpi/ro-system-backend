import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { Invoice, InvoicedProduct, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { IInvoiceFilters } from './invoice.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { invoiceSearchableFields } from './invoice.constant';
import { generateInvoiceNo } from './invoice.utils';

// create
const insertIntoDB = async (
  data: Invoice,
  invoicedProducts: InvoicedProduct[]
): Promise<Invoice | null> => {
  // generate invoice no
  const invoiceNo = await generateInvoiceNo();

  // set invoice no
  data.invoiceNo = invoiceNo;

  // set account head
  const findAccountHead = await prisma.accountHead.findFirst({
    where: { label: 'Sales' },
  });

  if (!findAccountHead) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Account Head Missing');
  }
  data.accountHeadId = findAccountHead.id;

  const result = await prisma.invoice.create({
    data: { ...data, invoicedProducts: { create: invoicedProducts } },
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// get all
const getAll = async (
  filters: IInvoiceFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Invoice[]>> => {
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
      OR: invoiceSearchableFields.map(field => ({
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

  const whereConditions: Prisma.InvoiceWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.invoice.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
    include: {
      customer: true,
      refNo: true,
      invoicedProducts: {
        include: {
          product: true,
        },
      },
    },
  });

  const total = await prisma.invoice.count({
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
const getSingle = async (id: string): Promise<Invoice | null> => {
  const result = await prisma.invoice.findUnique({
    where: {
      id,
    },
  });

  return result;
};

// update
const updateSingle = async (
  id: string,
  payload: Partial<Invoice>,
  invoicedProducts: InvoicedProduct[]
): Promise<Invoice | null> => {
  // check is exist
  const isExist = await prisma.invoice.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  if (isExist.status === 'Canceled') {
    throw new ApiError(httpStatus.NOT_FOUND, 'You cant Update after canceled');
  }
  if (isExist.status === 'Paid') {
    throw new ApiError(httpStatus.NOT_FOUND, 'You cant Update after paid');
  }

  const result = await prisma.$transaction(async trans => {
    await trans.invoice.update({
      where: {
        id,
      },
      data: {
        invoicedProducts: {
          deleteMany: {},
        },
      },
    });

    return await trans.invoice.update({
      where: {
        id,
      },
      data: {
        ...payload,
        invoicedProducts: {
          create: invoicedProducts,
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
const deleteFromDB = async (id: string): Promise<Invoice | null> => {
  // check is exist
  const isExist = await prisma.invoice.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  if (isExist.status === 'Canceled') {
    throw new ApiError(httpStatus.NOT_FOUND, 'You cant delete after canceled');
  }
  if (isExist.status === 'Paid') {
    throw new ApiError(httpStatus.NOT_FOUND, 'You cant delete after paid');
  }

  const result = await prisma.$transaction(async trans => {
    await trans.invoice.update({
      where: {
        id,
      },
      data: {
        invoicedProducts: {
          deleteMany: {},
        },
      },
    });

    return await trans.invoice.delete({
      where: {
        id,
      },
    });
  });

  return result;
};

const cancelInvoice = async (id: string): Promise<Invoice | null> => {
  // check is exist
  const isExist = await prisma.invoice.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }



  if (isExist.status === 'Canceled') {
    throw new ApiError(httpStatus.NOT_FOUND, 'Already Canceled');
  }

  if (isExist.status !== 'Due') {
    throw new ApiError(httpStatus.NOT_FOUND, 'You cant Cancel this invoice');
  }

  const result = await prisma.invoice.update({
    where: { id },
    data: { status: 'Canceled' },
  });
  return result;
};

export const InvoiceService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
  cancelInvoice,
};
