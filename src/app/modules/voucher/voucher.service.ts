import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import {
  Bill,
  Invoice,
  InvoiceBillStatus,
  Prisma,
  Voucher,
  VoucherDetail,
  VoucherType,
} from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { generateVoucherNo } from './voucher.utils';
import moment from 'moment';
import {
  CustomVoucherDetails,
  IVoucherFilters,
  IVoucherResponse,
} from './voucher.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { voucherSearchableFields } from './voucher.constant';

// create receive payment
const receivePayment = async (data: Voucher): Promise<Voucher | null> => {
  // generate voucher No
  const convertDate = moment(data.date).format('YYYYMMDD');
  const voucherNo = await generateVoucherNo(convertDate);

  // set voucher no
  data.voucherNo = voucherNo;
  data.type = VoucherType.Received;

  // find account head
  const findHead = await prisma.accountHead.findFirst({
    where: {
      label: 'CASH AND EQUIVALENT',
    },
  });

  if (!findHead) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Please setup your account head first!'
    );
  }

  // set head in data
  data.accountHeadId = findHead.id;

  const result = await prisma.voucher.create({ data });

  return result;
};

// update receive payment
const updateReceivePayment = async (
  id: string,
  data: Voucher,
  invoices: Partial<Invoice[]>,
  voucherDetails: VoucherDetail[]
): Promise<Voucher | null> => {
  // check is exist
  const isExist = await prisma.voucher.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Document Not Found');
  }

  const result = await prisma.$transaction(async trans => {
    await trans.voucher.update({
      where: { id },
      data: { voucherDetails: { deleteMany: {} } },
    });
    const updateVoucher = await trans.voucher.update({
      where: { id },
      data: { ...data, voucherDetails: { create: voucherDetails } },
    });

    if (invoices.length) {
      await Promise.all(
        invoices.map(async invoice => {
          const { id, ...otherValue } = invoice as Invoice;
          await trans.invoice.update({
            where: { id },
            data: otherValue,
          });
        })
      );
    }

    return updateVoucher;
  });

  return result;
};

// delete receive amount
const deleteReceiveVoucher = async (id: string): Promise<Voucher | null> => {
  // check is exist
  const isExist = await prisma.voucher.findFirst({
    where: {
      id,
    },
    include: {
      customer: true,
      vendor: true,
      voucherDetails: {
        include: {
          invoice: true,
          bill: true,
        },
      },
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const { voucherDetails } = isExist;

  const result = await prisma.$transaction(async trans => {
    if (voucherDetails.length) {
      await Promise.all(
        voucherDetails.map(async details => {
          const { invoice, ...otherValue } = details as CustomVoucherDetails;
          const paidAmount = invoice.paidAmount - otherValue.receiveAmount;
          await trans.invoice.update({
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
    await trans.voucher.update({
      where: { id },
      data: { voucherDetails: { deleteMany: {} } },
    });

    return await trans.voucher.delete({ where: { id } });
  });

  return result;
};

// create make payment
const makePayment = async (
  data: Voucher,
  bills: Partial<Bill[]>,
  voucherDetails: VoucherDetail[]
): Promise<Voucher | null> => {
  // generate voucher No
  const convertDate = moment(data.date).format('YYYYMMDD');
  const voucherNo = await generateVoucherNo(convertDate);

  // set voucher no
  data.voucherNo = voucherNo;
  data.type = VoucherType.Paid;

  // find account head
  const findHead = await prisma.accountHead.findFirst({
    where: {
      label: 'CASH AND EQUIVALENT',
    },
  });

  if (!findHead) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Please setup your account head first!'
    );
  }

  // set head in data
  data.accountHeadId = findHead.id;

  const result = await prisma.$transaction(async trans => {
    const insertVoucher = await trans.voucher.create({
      data: { ...data, voucherDetails: { create: voucherDetails } },
    });

    if (!insertVoucher) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
    }

    if (bills.length) {
      await Promise.all(
        bills.map(async bill => {
          const { id, ...otherValue } = bill as Bill;
          await trans.bill.update({
            where: { id },
            data: otherValue,
          });
        })
      );
    }

    return insertVoucher;
  });

  return result;
};

// get all
const getAll = async (
  filters: IVoucherFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IVoucherResponse>> => {
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
      OR: voucherSearchableFields.map(field => ({
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

  const whereConditions: Prisma.VoucherWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.voucher.findMany({
    where: whereConditions,
    orderBy: report
      ? { vendor: { vendorName: 'asc' } }
      : {
          [sortBy]: sortOrder,
        },
    skip,
    take: limit,
    include: {
      customer: true,
      vendor: true,
      voucherDetails: {
        include: {
          invoice: true,
          bill: true,
        },
      },
    },
  });

  const total = await prisma.voucher.count({
    where: whereConditions,
  });
  const totalPage = Math.ceil(total / limit);

  // total count
  const totalCount = await prisma.voucher.groupBy({
    where: whereConditions,
    by: ['accountHeadId'],
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

export const VoucherService = {
  receivePayment,
  updateReceivePayment,
  deleteReceiveVoucher,
  makePayment,
  getAll,
};
