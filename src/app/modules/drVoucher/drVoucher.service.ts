import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import {
  DrInvoice,
  InvoiceBillStatus,
  Prisma,
  DrVoucher,
  DrVoucherDetail,
} from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { generateDrVoucherNo } from './drVoucher.utils';
import moment from 'moment';
import {
  CustomDrVoucherDetails,
  IDrVoucherFilters,
  IDrVoucherResponse,
} from './drVoucher.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { drVoucherSearchableFields } from './drVoucher.constant';

// create
const insertIntoDB = async (
  data: DrVoucher,
  invoices: Partial<DrInvoice[]>,
  drVoucherDetails: DrVoucherDetail[]
): Promise<DrVoucher | null> => {
  // generate drVoucher No
  const convertDate = moment(data.date).format('YYYYMMDD');
  const voucherNo = await generateDrVoucherNo(convertDate);

  // set dr Voucher no
  data.voucherNo = voucherNo;

  const result = await prisma.$transaction(async trans => {
    const insertDrVoucher = await trans.drVoucher.create({
      data: { ...data, drVoucherDetails: { create: drVoucherDetails } },
    });

    if (!insertDrVoucher) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
    }

    if (invoices.length) {
      await Promise.all(
        invoices.map(async invoice => {
          const { id, ...otherValue } = invoice as DrInvoice;
          await trans.drInvoice.update({
            where: { id },
            data: otherValue,
          });
        })
      );
    }

    return insertDrVoucher;
  });

  return result;
};

// get all
const getAll = async (
  filters: IDrVoucherFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IDrVoucherResponse>> => {
  const { searchTerm, startDate, endDate, report, ...filterData } = filters;
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
      OR: drVoucherSearchableFields.map(field => ({
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
        [field]: value,
      })),
    });
  }

  const whereConditions: Prisma.DrVoucherWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.drVoucher.findMany({
    where: whereConditions,
    orderBy: report
      ? { customer: { customerName: 'asc' } }
      : {
          [sortBy]: sortOrder,
        },
    skip,
    take: limit,
    include: {
      customer: true,
      drVoucherDetails: {
        include: {
          invoice: true,
        },
      },
    },
  });

  const total = await prisma.drVoucher.count({
    where: whereConditions,
  });
  const totalPage = Math.ceil(total / limit);

  // total count
  const totalCount = await prisma.drVoucher.aggregate({
    where: whereConditions,
    _sum: {
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
      sum: totalCount,
    },
  };
};

// update
const updateSingle = async (
  id: string,
  data: DrVoucher,
  invoices: Partial<DrInvoice[]>,
  drVoucherDetails: DrVoucherDetail[]
): Promise<DrVoucher | null> => {
  // check is exist
  const isExist = await prisma.drVoucher.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Document Not Found');
  }

  // generate voucher no
  const convertDate = moment(data.date).format('YYYYMMDD');
  if (!isExist.voucherNo?.includes(convertDate)) {
    const voucherNo = await generateDrVoucherNo(convertDate);

    // set voucher no
    data.voucherNo = voucherNo;
  }

  const result = await prisma.$transaction(async trans => {
    await trans.drVoucher.update({
      where: { id },
      data: { drVoucherDetails: { deleteMany: {} } },
    });

    const updateDrVoucher = await trans.drVoucher.update({
      where: { id },
      data: { ...data, drVoucherDetails: { create: drVoucherDetails } },
    });

    if (invoices.length) {
      await Promise.all(
        invoices.map(async invoice => {
          const { id, ...otherValue } = invoice as DrInvoice;
          await trans.drInvoice.update({
            where: { id },
            data: otherValue,
          });
        })
      );
    }

    return updateDrVoucher;
  });

  return result;
};

// delete
const deleteFromDB = async (id: string): Promise<DrVoucher | null> => {
  // check is exist
  const isExist = await prisma.drVoucher.findFirst({
    where: {
      id,
    },
    include: {
      customer: true,
      drVoucherDetails: {
        include: {
          invoice: true,
        },
      },
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const { drVoucherDetails } = isExist;

  const result = await prisma.$transaction(async trans => {
    if (drVoucherDetails.length) {
      await Promise.all(
        drVoucherDetails.map(async details => {
          const { invoice, ...otherValue } = details as CustomDrVoucherDetails;
          const paidAmount = invoice.paidAmount - otherValue.receiveAmount;
          await trans.drInvoice.update({
            where: { id: invoice?.id },
            data: {
              paidAmount,
              status:
                paidAmount === 0
                  ? InvoiceBillStatus.Due
                  : paidAmount === invoice.amount
                  ? InvoiceBillStatus.Paid
                  : InvoiceBillStatus.Partial,
            },
          });
        })
      );
    }
    await trans.drVoucher.update({
      where: { id },
      data: { drVoucherDetails: { deleteMany: {} } },
    });

    return await trans.drVoucher.delete({ where: { id } });
  });

  return result;
};

export const DrVoucherService = {
  insertIntoDB,
  getAll,
  updateSingle,
  deleteFromDB,
};
