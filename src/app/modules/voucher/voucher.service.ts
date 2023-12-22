import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { Invoice, Prisma, Voucher, VoucherType } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { generateVoucherNo } from './voucher.utils';
import moment from 'moment';
import { IVoucherFilters } from './voucher.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { voucherSearchableFields } from './voucher.constant';

// create
const receivePayment = async (
  data: Voucher,
  invoices: Partial<Invoice[]>
): Promise<Voucher | null> => {
  // generate voucher No
  const convertDate = moment(data.date).format('YYYYMMDD');
  const voucherNo = await generateVoucherNo(convertDate);

  // set voucher no
  data.voucherNo = voucherNo;
  data.type = VoucherType.Received;

  // find account head
  const findHead = await prisma.accountHead.findFirst({
    where: {
      label: 'Cash and Equivalent',
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
    const insertVoucher = await trans.voucher.create({ data });

    if (!insertVoucher) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
    }

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

    return insertVoucher;
  });

  return result;
};

// get all
const getAll = async (
  filters: IVoucherFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Voucher[]>> => {
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
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
    include: {
      customer: true,
    },
  });

  const total = await prisma.voucher.count({
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

// // get single
// const getSingle = async (id: string): Promise<Expense | null> => {
//   const result = await prisma.expense.findUnique({
//     where: {
//       id,
//     },
//   });

//   return result;
// };

// // update
// const updateSingle = async (
//   id: string,
//   payload: Partial<Expense>,
//   expenseDetails: ExpenseDetail[]
// ): Promise<Expense | null> => {
//   // check is exist
//   const isExist = await prisma.expense.findUnique({
//     where: {
//       id,
//     },
//   });

//   if (!isExist) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
//   }

//   if (isExist.status === 'Paid') {
//     throw new ApiError(httpStatus.NOT_FOUND, 'You cant Update after paid');
//   }
//   if (isExist.status === 'Canceled') {
//     throw new ApiError(httpStatus.NOT_FOUND, 'You cant Update after canceled');
//   }

//   const result = await prisma.$transaction(async trans => {
//     await trans.expense.update({
//       where: {
//         id,
//       },
//       data: {
//         expenseDetails: {
//           deleteMany: {},
//         },
//       },
//     });

//     return await trans.expense.update({
//       where: {
//         id,
//       },
//       data: {
//         ...payload,
//         expenseDetails: {
//           create: expenseDetails,
//         },
//       },
//     });
//   });

//   if (!result) {
//     throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Update');
//   }

//   return result;
// };

// // delete
// const deleteFromDB = async (id: string): Promise<Expense | null> => {
//   // check is exist
//   const isExist = await prisma.expense.findUnique({
//     where: {
//       id,
//     },
//   });

//   if (!isExist) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
//   }

//   if (isExist.status === 'Paid') {
//     throw new ApiError(httpStatus.NOT_FOUND, 'You cant delete after Paid');
//   }
//   if (isExist.status === 'Canceled') {
//     throw new ApiError(httpStatus.NOT_FOUND, 'You cant delete after canceled');
//   }

//   const result = await prisma.$transaction(async trans => {
//     await trans.expense.update({
//       where: {
//         id,
//       },
//       data: {
//         expenseDetails: {
//           deleteMany: {},
//         },
//       },
//     });

//     return await trans.expense.delete({
//       where: {
//         id,
//       },
//     });
//   });

//   return result;
// };

export const VoucherService = {
  receivePayment,
  getAll,
  //   getSingle,
  //   updateSingle,
  //   deleteFromDB,
};
