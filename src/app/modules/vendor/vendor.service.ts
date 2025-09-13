import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { Vendor, Prisma, InvoiceBillStatus } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { IVendorDetails, IVendorFilters } from './vendor.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { vendorSearchableFields } from './vendor.constant';
import { generateVendorId } from './vendor.utils';

// create
const insertIntoDB = async (data: Vendor): Promise<Vendor | null> => {
  // generate vendor id
  const vendorId = await generateVendorId();

  // set vendor id
  data.vendorId = vendorId;
  const result = await prisma.vendor.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// get all
const getAll = async (
  filters: IVendorFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Vendor[]>> => {
  const { searchTerm, forVoucher, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: vendorSearchableFields.map(field => ({
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

  const whereConditions: Prisma.VendorWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.vendor.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
    include: {
      bills: forVoucher
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

  const total = await prisma.vendor.count({
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
const getSingle = async (id: string): Promise<Vendor | null> => {
  const result = await prisma.vendor.findFirst({
    where: {
      id,
    },
  });

  return result;
};

// update
const updateSingle = async (
  id: string,
  payload: Partial<Vendor>
): Promise<Vendor | null> => {
  // check is exist
  const isExist = await prisma.vendor.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.vendor.update({
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
const deleteFromDB = async (id: string): Promise<Vendor | null> => {
  // check is exist
  const isExist = await prisma.vendor.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.vendor.delete({
    where: {
      id,
    },
  });

  return result;
};

// get vendor details
const getVendorDetails = async (): Promise<IVendorDetails[]> => {
  // find bills
  const bills = await prisma.bill.groupBy({
    by: ['vendorId'],
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
    by: ['vendorId'],
    _sum: {
      amount: true,
    },
    _max: {
      date: true,
    },
  });

  // vendors
  const vendors = await prisma.vendor.findMany({
    where: {
      isActive: true,
    },
    select: {
      id: true,
      vendorId: true,
      vendorName: true,
      vendorNameBn: true,
      mobile: true,
      address: true,
    },
  });

  // set voucher and bills in vendors
  const result = vendors.map(el => {
    const findBillSum = bills?.find(bl => bl.vendorId === el.id);
    const findVoucherSum = vouchers?.find(vou => vou.vendorId === el.id);

    return {
      ...el,
      bills: {
        buyAmount: findBillSum?._sum?.amount,
        paidAmount: findBillSum?._sum?.paidAmount,
        voucherAmount: findVoucherSum?._sum?.amount,
        lastPaymentDate: findVoucherSum?._max?.date,
        lastBuyDate: findBillSum?._max?.date,
      },
    };
  });

  return result;
};

export const VendorService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
  getVendorDetails,
};
