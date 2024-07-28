import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import {
  InvoiceBillStatus,
  Prisma,
  DistVoucher,
  DistVoucherDetail,
  VoucherType,
  DistInvoice,
} from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { generateDistVoucherNo } from './distVoucher.utils';
import moment from 'moment';
import {
  CustomDistVoucherDetails,
  IDistVoucherFilters,
  IDistVoucherResponse,
} from './distVoucher.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { distVoucherSearchableFields } from './distVoucher.constant';

// create receive payment
const receivePayment = async (
  data: DistVoucher,
  invoices: Partial<DistInvoice[]>,
  distVoucherDetails: DistVoucherDetail[]
): Promise<DistVoucher | null> => {
  // generate distVoucher No
  const convertDate = moment(data.date).format('YYYYMMDD');
  const voucherNo = await generateDistVoucherNo(convertDate);

  // set distVoucher no
  data.voucherNo = voucherNo;
  data.type = VoucherType.Received;

  const result = await prisma.$transaction(async trans => {
    const insertDistVoucher = await trans.distVoucher.create({
      data: { ...data, distVoucherDetails: { create: distVoucherDetails } },
    });

    if (!insertDistVoucher) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
    }

    if (invoices.length) {
      await Promise.all(
        invoices.map(async invoice => {
          const { id, ...otherValue } = invoice as DistInvoice;
          await trans.distInvoice.update({
            where: { id },
            data: otherValue,
          });
        })
      );
    }

    return insertDistVoucher;
  });

  return result;
};

// update receive payment
const updateReceivePayment = async (
  id: string,
  data: DistVoucher,
  invoices: Partial<DistInvoice[]>,
  distVoucherDetails: DistVoucherDetail[]
): Promise<DistVoucher | null> => {
  // check is exist
  const isExist = await prisma.distVoucher.findFirst({
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
    const voucherNo = await generateDistVoucherNo(convertDate);

    // set voucher no
    data.voucherNo = voucherNo;
  }

  const result = await prisma.$transaction(async trans => {
    await trans.distVoucher.update({
      where: { id },
      data: { distVoucherDetails: { deleteMany: {} } },
    });
    const updateDistVoucher = await trans.distVoucher.update({
      where: { id },
      data: { ...data, distVoucherDetails: { create: distVoucherDetails } },
    });

    if (invoices.length) {
      await Promise.all(
        invoices.map(async invoice => {
          const { id, ...otherValue } = invoice as DistInvoice;
          await trans.distInvoice.update({
            where: { id },
            data: otherValue,
          });
        })
      );
    }

    return updateDistVoucher;
  });

  return result;
};

// delete receive amount
const deleteReceiveDistVoucher = async (
  id: string
): Promise<DistVoucher | null> => {
  // check is exist
  const isExist = await prisma.distVoucher.findFirst({
    where: {
      id,
    },
    include: {
      customer: true,
      vendor: true,
      distVoucherDetails: {
        include: {
          invoice: true,
        },
      },
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const { distVoucherDetails } = isExist;

  const result = await prisma.$transaction(async trans => {
    if (distVoucherDetails.length) {
      await Promise.all(
        distVoucherDetails.map(async details => {
          const { invoice, ...otherValue } =
            details as CustomDistVoucherDetails;
          const paidAmount = invoice.paidAmount - otherValue.receiveAmount;
          await trans.distInvoice.update({
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
    await trans.distVoucher.update({
      where: { id },
      data: { distVoucherDetails: { deleteMany: {} } },
    });

    return await trans.distVoucher.delete({ where: { id } });
  });

  return result;
};

// get all
const getAll = async (
  filters: IDistVoucherFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IDistVoucherResponse>> => {
  const {
    searchTerm,
    startDate,
    endDate,
    distributorId,
    report,
    ...filterData
  } = filters;
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
      OR: distVoucherSearchableFields.map(field => ({
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
        [field]: value,
      })),
    });
  }

  const whereConditions: Prisma.DistVoucherWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.distVoucher.findMany({
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
      distVoucherDetails: {
        include: {
          invoice: true,
        },
      },
    },
  });

  const total = await prisma.distVoucher.count({
    where: whereConditions,
  });
  const totalPage = Math.ceil(total / limit);

  // total count
  const totalCount = await prisma.distVoucher.aggregate({
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

export const DistVoucherService = {
  receivePayment,
  updateReceivePayment,
  deleteReceiveDistVoucher,
  getAll,
};
