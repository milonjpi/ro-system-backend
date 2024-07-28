import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { DrCustomer, InvoiceBillStatus, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { IDrCustomerDetails, IDrCustomerFilters } from './drCustomer.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { drCustomerSearchableFields } from './drCustomer.constant';
import { generateDrCustomerId } from './drCustomer.utils';

// create
const insertIntoDB = async (data: DrCustomer): Promise<DrCustomer | null> => {
  // generate Customer id
  const customerId = await generateDrCustomerId();

  // set Customer id
  data.customerId = customerId;

  const result = await prisma.drCustomer.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// get all
const getAll = async (
  filters: IDrCustomerFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<DrCustomer[]>> => {
  const { searchTerm, forVoucher, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: drCustomerSearchableFields.map(field => ({
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

  const whereConditions: Prisma.DrCustomerWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.drCustomer.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
    include: {
      drInvoices: forVoucher
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

  const total = await prisma.drCustomer.count({
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
const getSingle = async (id: string): Promise<DrCustomer | null> => {
  const result = await prisma.drCustomer.findFirst({
    where: {
      id,
    },
  });

  return result;
};

// update
const updateSingle = async (
  id: string,
  payload: Partial<DrCustomer>
): Promise<DrCustomer | null> => {
  // check is exist
  const isExist = await prisma.drCustomer.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.drCustomer.update({
    where: { id },
    data: payload,
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Update');
  }

  return result;
};

// delete
const deleteFromDB = async (id: string): Promise<DrCustomer | null> => {
  // check is exist
  const isExist = await prisma.drCustomer.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.drCustomer.delete({
    where: {
      id,
    },
  });

  return result;
};

// get drCustomer details
const getDrCustomerDetails = async (
  filters: IDrCustomerFilters
): Promise<IDrCustomerDetails[]> => {
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: drCustomerSearchableFields.map(field => ({
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

  const whereConditions: Prisma.DrCustomerWhereInput =
    andConditions.length > 0
      ? { AND: andConditions, isActive: true }
      : { isActive: true };

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

  // drCustomers
  const drCustomers = await prisma.drCustomer.findMany({
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

  // set voucher and invoices in drCustomer
  const result = drCustomers.map(el => {
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

export const DrCustomerService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
  getDrCustomerDetails,
};
