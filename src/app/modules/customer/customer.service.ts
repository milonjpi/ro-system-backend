import httpStatus from 'http-status';
import bcrypt from 'bcryptjs';
import prisma from '../../../shared/prisma';
import { Customer, InvoiceBillStatus, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { ICustomerDetails, ICustomerFilters } from './customer.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { customerSearchableFields } from './customer.constant';
import { generateCustomerId } from './customer.utils';
import config from '../../../config';

// create
const insertIntoDB = async (data: Customer): Promise<Customer | null> => {
  // generate customer id
  const customerId = await generateCustomerId();

  // set customer id
  data.customerId = customerId;

  const result = await prisma.$transaction(async trans => {
    const saveCustomer = await trans.customer.create({
      data,
      include: { group: true },
    });

    if (saveCustomer?.group?.label === 'DISTRIBUTOR') {
      await trans.user.create({
        data: {
          fullName: saveCustomer?.customerName,
          userName: saveCustomer?.customerId,
          password: await bcrypt.hash(
            '12345',
            Number(config.bcrypt_salt_rounds)
          ),
          distributorId: saveCustomer.id,
        },
      });
    }

    return saveCustomer;
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// create
const insertIntoDBAll = async (data: Customer[]): Promise<string | null> => {
  const result = await prisma.customer.createMany({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return 'result';
};

// get all
const getAll = async (
  filters: ICustomerFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Customer[]>> => {
  const { searchTerm, forVoucher, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: customerSearchableFields.map(field => ({
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

  const whereConditions: Prisma.CustomerWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.customer.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
    include: {
      group: true,
      invoices: forVoucher
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

  const total = await prisma.customer.count({
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
const getSingle = async (id: string): Promise<Customer | null> => {
  const result = await prisma.customer.findFirst({
    where: {
      id,
    },
    include: {
      group: true,
    },
  });

  return result;
};

// update
const updateSingle = async (
  id: string,
  payload: Partial<Customer>
): Promise<Customer | null> => {
  // check is exist
  const isExist = await prisma.customer.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.$transaction(async trans => {
    const updateCustomer = await trans.customer.update({
      where: {
        id,
      },
      data: payload,
      include: {
        group: true,
      },
    });
    const findUser = await trans.user.findFirst({
      where: { distributorId: id },
    });

    if (findUser && updateCustomer?.group?.label === 'DISTRIBUTOR') {
      await trans.user.update({
        where: { id: findUser?.id },
        data: {
          isActive: true,
        },
      });
    }

    if (!findUser && updateCustomer?.group?.label === 'DISTRIBUTOR') {
      await trans.user.create({
        data: {
          fullName: updateCustomer?.customerName,
          userName: updateCustomer?.customerId,
          password: await bcrypt.hash(
            '12345',
            Number(config.bcrypt_salt_rounds)
          ),
          distributorId: updateCustomer.id,
        },
      });
    }
    if (findUser && updateCustomer?.group?.label !== 'DISTRIBUTOR') {
      await trans.user.update({
        where: { id: findUser.id },
        data: {
          isActive: false,
        },
      });
    }

    return updateCustomer;
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Update');
  }

  return result;
};

// delete
const deleteFromDB = async (id: string): Promise<Customer | null> => {
  // check is exist
  const isExist = await prisma.customer.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.customer.delete({
    where: {
      id,
    },
  });

  return result;
};

// get customer details
const getCustomerDetails = async (
  filters: ICustomerFilters
): Promise<ICustomerDetails[]> => {
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: customerSearchableFields.map(field => ({
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

  const whereConditions: Prisma.CustomerWhereInput =
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

  // customers
  const customers = await prisma.customer.findMany({
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

  // set voucher and invoices in customer
  const result = customers.map(el => {
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

export const CustomerService = {
  insertIntoDB,
  insertIntoDBAll,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
  getCustomerDetails,
};
