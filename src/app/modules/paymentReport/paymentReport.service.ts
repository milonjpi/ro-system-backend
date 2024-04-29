import prisma from '../../../shared/prisma';
import { Prisma } from '@prisma/client';
import {
  IPaymentAdvanceReport,
  IPaymentDueFilters,
  IPaymentDueReport,
} from './paymentReport.interface';

// get due report
const dueReport = async (
  filters: IPaymentDueFilters
): Promise<IPaymentDueReport[]> => {
  const { startDate, endDate } = filters;

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
  const whereConditions: Prisma.BillWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};
  // find bills
  const bills = await prisma.bill.groupBy({
    where: whereConditions,
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

  // set voucher and bills in vendor
  const result = vendors.map(el => {
    const findBillSum = bills?.find(inv => inv.vendorId === el.id);
    const findVoucherSum = vouchers?.find(vou => vou.vendorId === el.id);

    return {
      ...el,
      amount: findBillSum?._sum?.amount || 0,
      paidAmount: findBillSum?._sum?.paidAmount || 0,
      lastPaymentDate: findVoucherSum?._max?.date,
      lastBillDate: findBillSum?._max?.date,
      differentAmount:
        (findBillSum?._sum?.amount || 0) - (findBillSum?._sum?.paidAmount || 0),
    };
  });

  return result;
};

// get advance report
const advanceReport = async (): Promise<IPaymentAdvanceReport[]> => {
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

  // set voucher and bills in vendor
  const result = vendors.map(el => {
    const findBillSum = bills?.find(inv => inv.vendorId === el.id);
    const findVoucherSum = vouchers?.find(vou => vou.vendorId === el.id);

    return {
      ...el,
      amount: findBillSum?._sum?.amount || 0,
      paidAmount: findBillSum?._sum?.paidAmount || 0,
      paymentAmount: findVoucherSum?._sum?.amount || 0,
      lastPaymentDate: findVoucherSum?._max?.date,
      lastBillDate: findBillSum?._max?.date,
      differentAmount:
        (findVoucherSum?._sum?.amount || 0) -
        (findBillSum?._sum?.paidAmount || 0),
    };
  });

  return result;
};
//   // get summary
//   const summary = async (
//     customerId: string | undefined
//   ): Promise<IInvoiceSummary[]> => {
//     const customer = customerId || '';

//     const result = (await prisma.$queryRaw`SELECT
//     EXTRACT(YEAR FROM date) AS year,
//     EXTRACT(MONTH FROM date) AS month,
//     SUM("totalQty") AS "totalQty",
//     SUM("totalPrice") AS "totalPrice",
//     SUM(discount) AS discount,
//     SUM(amount) AS amount,
//     SUM("paidAmount") AS "paidAmount"
//   FROM invoices
//   WHERE "customerId" LIKE ${`%${customer}%`}
//   GROUP BY year, month
//   ORDER BY year, month`) as IInvoiceSummary[];

//     const result2 = (await prisma.$queryRaw`SELECT
//     EXTRACT(YEAR FROM i.date) AS year,
//     EXTRACT(MONTH FROM i.date) AS month,
//     ip."productId",
//     SUM(ip.quantity) AS quantity
//   FROM invoices i
//   JOIN "invoicedProducts" ip ON i.id = ip."invoiceId"
//   WHERE i."customerId" LIKE ${`%${customer}%`}
//   GROUP BY year, month, ip."productId"
//   ORDER BY year, month, ip."productId"`) as IProductSum[];

//     const finalResult = result?.map(el => ({
//       ...el,
//       products: result2,
//     }));

//     return finalResult;
//   };

export const PaymentReportService = {
  dueReport,
  advanceReport,
};
