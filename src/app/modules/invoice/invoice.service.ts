import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { Invoice, InvoicedProduct, Prisma, VoucherType } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { IInvoiceFilters, IInvoiceResponse } from './invoice.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { invoiceSearchableFields } from './invoice.constant';
import { generateInvoiceNo } from './invoice.utils';
import moment from 'moment';
import { generateVoucherNo } from '../voucher/voucher.utils';

// create
const insertIntoDB = async (
  data: Invoice,
  invoicedProducts: InvoicedProduct[],
  voucher: { amount: number }
): Promise<Invoice | null> => {
  // generate invoice no
  const convertDate = moment(data.date).format('YYYYMMDD');
  const invoiceNo = await generateInvoiceNo(convertDate);

  // set invoice no
  data.invoiceNo = invoiceNo;

  // set account head
  const findAccountHead = await prisma.accountHead.findFirst({
    where: { label: 'SALES' },
  });

  if (!findAccountHead) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Account Head Missing');
  }
  data.accountHeadId = findAccountHead.id;

  const result = await prisma.$transaction(async trans => {
    const createInvoice = await trans.invoice.create({
      data: {
        ...data,
        version: true,
        invoicedProducts: { create: invoicedProducts },
      },
    });

    if (voucher.amount > 0) {
      // generate voucher No
      const convertDate = moment(data.date).format('YYYYMMDD');
      const voucherNo = await generateVoucherNo(convertDate);

      // find account head
      const findHead = await trans.accountHead.upsert({
        where: {
          label: 'CASH AND EQUIVALENT',
        },
        create: {
          label: 'CASH AND EQUIVALENT',
          accountType: { connect: { label: 'ASSET' } },
        },
        update: {},
      });

      if (!findHead) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          'Please setup your account head first!'
        );
      }

      await trans.voucher.create({
        data: {
          voucherNo: voucherNo,
          type: VoucherType.Received,
          accountHeadId: findHead.id,
          date: data.date,
          amount: voucher.amount,
          customerId: data.customerId,
          narration: '',
          userId: data?.userId,
          version: true,
          voucherDetails: {
            create: [
              {
                invoiceId: createInvoice.id,
                receiveAmount: voucher.amount,
              },
            ],
          },
        },
      });
    }

    return createInvoice;
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
): Promise<IGenericResponse<IInvoiceResponse>> => {
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
      voucherDetails: { include: { voucher: true } },
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

  const totalCount = await prisma.invoice.groupBy({
    where: whereConditions,
    by: ['accountHeadId'],
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
  invoicedProducts: InvoicedProduct[],
  voucher: { id: string; amount: number }
): Promise<Invoice | null> => {
  // check is exist
  const isExist = await prisma.invoice.findFirst({
    where: {
      id,
    },
    include: {
      voucherDetails: true,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  if (isExist.status === 'Canceled') {
    throw new ApiError(httpStatus.NOT_FOUND, 'You cant Update after canceled');
  }

  // generate invoice no
  const convertDate = moment(payload.date).format('YYYYMMDD');
  if (!payload.invoiceNo?.includes(convertDate)) {
    const invoiceNo = await generateInvoiceNo(convertDate);

    // set invoice no
    payload.invoiceNo = invoiceNo;
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

    const updateIn = await trans.invoice.update({
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

    const findVoucher = await trans.voucher.findFirst({
      where: { id: voucher.id },
    });

    if (findVoucher) {
      if (voucher.amount > 0) {
        await trans.voucher.update({
          where: { id: voucher.id },
          data: {
            date: payload.date,
            amount: voucher.amount,
            narration: '',
            voucherDetails: {
              updateMany: {
                where: { invoiceId: id },
                data: { receiveAmount: voucher.amount },
              },
            },
          },
        });
      } else {
        await trans.voucher.update({
          where: { id: voucher.id },
          data: { voucherDetails: { deleteMany: {} } },
        });

        await trans.voucher.delete({
          where: { id: voucher.id },
        });
      }
    } else {
      if (voucher.amount > 0) {
        // generate voucher No
        const convertDate = moment(payload.date).format('YYYYMMDD');
        const voucherNo = await generateVoucherNo(convertDate);

        // find account head
        const findHead = await trans.accountHead.upsert({
          where: {
            label: 'CASH AND EQUIVALENT',
          },
          create: {
            label: 'CASH AND EQUIVALENT',
            accountType: { connect: { label: 'ASSET' } },
          },
          update: {},
        });

        if (!findHead) {
          throw new ApiError(
            httpStatus.BAD_REQUEST,
            'Please setup your account head first!'
          );
        }

        await trans.voucher.create({
          data: {
            voucherNo: voucherNo,
            type: VoucherType.Received,
            accountHeadId: findHead.id,
            date: payload.date || new Date(),
            amount: voucher.amount,
            customerId: isExist.customerId,
            narration: '',
            userId: isExist?.userId,
            version: true,
            voucherDetails: {
              create: [
                {
                  invoiceId: id,
                  receiveAmount: voucher.amount,
                },
              ],
            },
          },
        });
      }
    }

    return updateIn;
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Update');
  }

  return result;
};

// delete
const deleteFromDB = async (id: string): Promise<Invoice | null> => {
  // check is exist
  const isExist = await prisma.invoice.findFirst({
    where: {
      id,
      version: true,
    },
    include: {
      voucherDetails: true,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  const result = await prisma.$transaction(async trans => {
    if (isExist.voucherDetails?.length) {
      // voucher
      await trans.voucher.update({
        where: { id: isExist.voucherDetails[0].voucherId },
        data: { voucherDetails: { deleteMany: {} } },
      });

      await trans.voucher.delete({
        where: { id: isExist.voucherDetails[0].voucherId },
      });
    }

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

export const InvoiceService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
