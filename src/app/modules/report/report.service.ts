import { Customer, Prisma } from '@prisma/client';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IDueFilters } from './report.interface';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import prisma from '../../../shared/prisma';

// get due report
const dueReport = async (
  filters: IDueFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<any[]>> => {
  const { customerId, startDate, endDate } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];
  const invoiceCondition = [];

  if (customerId) {
    andConditions.push({
      id: customerId,
    });
  }

  if (startDate) {
    invoiceCondition.push({
      date: {
        gte: new Date(`${startDate}, 00:00:00`),
      },
    });
  }

  if (endDate) {
    invoiceCondition.push({
      date: {
        lte: new Date(`${endDate}, 23:59:59`),
      },
    });
  }

  const whereConditions: Prisma.InvoiceWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.invoice.groupBy({
    by: ['customerId'],
    where: whereConditions,
    _sum: {
      amount: true,
      paidAmount: true,
    },
  });

  const totalPage = 0;

  return {
    meta: {
      page,
      limit,
      total: 0,
      totalPage,
    },
    data: result,
  };
};

export const ReportService = {
  dueReport,
};
