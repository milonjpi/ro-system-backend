import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { DistClient, InvoiceBillStatus, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { IDistClientDetails, IDistClientFilters } from './distClient.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { distClientSearchableFields } from './distClient.constant';
import { generateDistClientId } from './distClient.utils';

// create
const insertIntoDB = async (data: DistClient): Promise<DistClient | null> => {
  // generate distClient id
  const customerId = await generateDistClientId();

  // set distClient id
  data.customerId = customerId;
  const result = await prisma.distClient.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// create
const insertIntoDBAll = async (data: DistClient[]): Promise<string | null> => {
  const result = await prisma.distClient.createMany({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return 'result';
};

// get all
const getAll = async (
  filters: IDistClientFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<DistClient[]>> => {
  const { searchTerm, forVoucher, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: distClientSearchableFields.map(field => ({
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

  const whereConditions: Prisma.DistClientWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.distClient.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
    include: {
      distInvoices: forVoucher
        ? {
            where: {
              status: {
                in: [InvoiceBillStatus.Due, InvoiceBillStatus.Partial],
              },
            },
          }
        : false,
    },
  });

  const total = await prisma.distClient.count({
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
const getSingle = async (id: string): Promise<DistClient | null> => {
  const result = await prisma.distClient.findUnique({
    where: {
      id,
    },
  });

  return result;
};

// update
const updateSingle = async (
  id: string,
  payload: Partial<DistClient>
): Promise<DistClient | null> => {
  // check is exist
  const isExist = await prisma.distClient.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.distClient.update({
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
const deleteFromDB = async (id: string): Promise<DistClient | null> => {
  // check is exist
  const isExist = await prisma.distClient.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.distClient.delete({
    where: {
      id,
    },
  });

  return result;
};

// get distClient details
const getDistClientDetails = async (
  filters: IDistClientFilters
): Promise<IDistClientDetails[]> => {
  // find invoices
  const invoices = await prisma.invoice.groupBy({
    by: ['customerId'],
    _sum: {
      amount: true,
      paidAmount: true,
    },
    _max: {
      date: true,
    },
  });

  // find vouchers
  const vouchers = await prisma.voucher.groupBy({
    by: ['customerId'],
    _sum: {
      amount: true,
    },
    _max: {
      date: true,
    },
  });

  // searching
  const { searchTerm, ...filterData } = filters;
  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: distClientSearchableFields.map(field => ({
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

  const whereConditions: Prisma.DistClientWhereInput =
    andConditions.length > 0
      ? { AND: andConditions, isActive: true }
      : { isActive: true };

  // distClients
  const distClients = await prisma.distClient.findMany({
    where: whereConditions,
    select: {
      id: true,
      customerId: true,
      customerName: true,
      customerNameBn: true,
      mobile: true,
      address: true,
    },
    orderBy: {
      customerName: 'asc',
    },
  });

  // set voucher and invoices in distClient
  const result = distClients.map(el => {
    const findInvoiceSum = invoices?.find(inv => inv.customerId === el.id);
    const findVoucherSum = vouchers?.find(vou => vou.customerId === el.id);

    return {
      ...el,
      invoices: {
        saleAmount: findInvoiceSum?._sum?.amount,
        paidAmount: findInvoiceSum?._sum?.paidAmount,
        voucherAmount: findVoucherSum?._sum?.amount,
        lastPaymentDate: findVoucherSum?._max?.date,
        lastSaleDate: findInvoiceSum?._max?.date,
      },
    };
  });

  return result;
};

export const DistClientService = {
  insertIntoDB,
  insertIntoDBAll,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
  getDistClientDetails,
};
