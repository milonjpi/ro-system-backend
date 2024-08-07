import prisma from '../../../shared/prisma';
import { Customer, Prisma } from '@prisma/client';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { ICustomInvoiceFilters } from './customInvoice.interface';

// get custom invoice
const getCustomInvoices = async (
  filters: ICustomInvoiceFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Customer[]>> => {
  const { groupId, customerId, startDate, endDate } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const customerConditions = [];

  if (groupId) {
    customerConditions.push({ groupId: groupId });
  }

  if (customerId) {
    customerConditions.push({ id: customerId });
  }

  const customerWhereConditions: Prisma.CustomerWhereInput =
    customerConditions.length > 0 ? { AND: customerConditions } : {};

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

  const whereConditions: Prisma.InvoiceWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.customer.findMany({
    where: customerWhereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
    include: {
      invoices: {
        where: whereConditions,
        include: {
          refNo: true,
          invoicedProducts: {
            include: {
              product: true,
            },
          },
        },
        orderBy: { date: 'asc' },
      },
    },
  });

  const total = await prisma.customer.count({
    where: customerWhereConditions,
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

export const CustomInvoiceService = {
  getCustomInvoices,
};
