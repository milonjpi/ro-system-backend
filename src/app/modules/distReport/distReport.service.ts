import prisma from '../../../shared/prisma';
import { Prisma } from '@prisma/client';
import {
  IDistAdvanceReport,
  IDistDashboardResponse,
  IDistDueFilters,
  IDistDueReport,
  IDistInvoiceSummary,
  IDistProductSum,
} from './distReport.interface';

// get due report
const dueReport = async (
  filters: IDistDueFilters
): Promise<IDistDueReport[]> => {
  const { distributorId } = filters;

  const andConditions = [];

  if (distributorId) {
    andConditions.push({ distributorId: distributorId });
  }

  const whereConditions: Prisma.DistClientWhereInput =
    andConditions.length > 0
      ? { AND: andConditions, isActive: true }
      : { isActive: true };
  // find invoices
  const invoices = await prisma.distInvoice.groupBy({
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
  const vouchers = await prisma.distVoucher.groupBy({
    by: ['customerId'],
    _max: {
      date: true,
    },
  });

  // customers
  const customers = await prisma.distClient.findMany({
    where: whereConditions,
    select: {
      id: true,
      customerId: true,
      customerName: true,
      customerNameBn: true,
      mobile: true,
      address: true,
    },
  });

  // set voucher and invoices in customer
  const result = customers.map(el => {
    const findInvoiceSum = invoices?.find(inv => inv.customerId === el.id);
    const findVoucherSum = vouchers?.find(vou => vou.customerId === el.id);

    return {
      ...el,
      amount: findInvoiceSum?._sum?.amount || 0,
      paidAmount: findInvoiceSum?._sum?.paidAmount || 0,
      lastPaymentDate: findVoucherSum?._max?.date,
      lastSaleDate: findInvoiceSum?._max?.date,
      differentAmount:
        (findInvoiceSum?._sum?.amount || 0) -
        (findInvoiceSum?._sum?.paidAmount || 0),
    };
  });

  return result;
};

// get advance report
const advanceReport = async (
  filters: IDistDueFilters
): Promise<IDistAdvanceReport[]> => {
  const { distributorId } = filters;

  const andConditions = [];

  if (distributorId) {
    andConditions.push({ distributorId: distributorId });
  }

  const whereConditions: Prisma.DistClientWhereInput =
    andConditions.length > 0
      ? { AND: andConditions, isActive: true }
      : { isActive: true };

  // find invoices
  const invoices = await prisma.distInvoice.groupBy({
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
  const vouchers = await prisma.distVoucher.groupBy({
    by: ['customerId'],
    _sum: {
      amount: true,
    },
    _max: {
      date: true,
    },
  });

  // customers
  const customers = await prisma.distClient.findMany({
    where: whereConditions,
    select: {
      id: true,
      customerId: true,
      customerName: true,
      customerNameBn: true,
      mobile: true,
      address: true,
    },
  });

  // set voucher and invoices in customer
  const result = customers.map(el => {
    const findInvoiceSum = invoices?.find(inv => inv.customerId === el.id);
    const findVoucherSum = vouchers?.find(vou => vou.customerId === el.id);

    return {
      ...el,
      amount: findInvoiceSum?._sum?.amount || 0,
      paidAmount: findInvoiceSum?._sum?.paidAmount || 0,
      receiveAmount: findVoucherSum?._sum?.amount || 0,
      lastPaymentDate: findVoucherSum?._max?.date,
      lastSaleDate: findInvoiceSum?._max?.date,
      differentAmount:
        (findVoucherSum?._sum?.amount || 0) -
        (findInvoiceSum?._sum?.paidAmount || 0),
    };
  });

  return result;
};
// get summary
const summary = async (
  customerId: string | undefined
): Promise<IDistInvoiceSummary[]> => {
  const customer = customerId || '';

  const result = (await prisma.$queryRaw`SELECT
    EXTRACT(YEAR FROM date) AS year,
    EXTRACT(MONTH FROM date) AS month,
    SUM("totalQty") AS "totalQty",
    SUM("totalPrice") AS "totalPrice",
    SUM(discount) AS discount,
    SUM(amount) AS amount,
    SUM("paidAmount") AS "paidAmount"
  FROM invoices
  WHERE "customerId" LIKE ${`%${customer}%`}
  GROUP BY year, month
  ORDER BY year, month`) as IDistInvoiceSummary[];

  const result2 = (await prisma.$queryRaw`SELECT
    EXTRACT(YEAR FROM i.date) AS year,
    EXTRACT(MONTH FROM i.date) AS month,
    ip."productId",
    SUM(ip.quantity) AS quantity
  FROM invoices i
  JOIN "invoicedProducts" ip ON i.id = ip."invoiceId"
  WHERE i."customerId" LIKE ${`%${customer}%`}
  GROUP BY year, month, ip."productId"
  ORDER BY year, month, ip."productId"`) as IDistProductSum[];

  const finalResult = result?.map(el => ({
    ...el,
    products: result2,
  }));

  return finalResult;
};

// get vendor due advance report
const vendorDueAdvanced = async (): Promise<IDistAdvanceReport[]> => {
  // find invoices
  const invoices = await prisma.invoice.groupBy({
    by: ['customerId'],
    _sum: {
      totalQty: true,
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
    where: {
      isActive: true,
      isDistributor: true,
    },
    select: {
      id: true,
      customerId: true,
      customerName: true,
      customerNameBn: true,
      mobile: true,
      address: true,
    },
  });

  // set voucher and invoices in customer
  const result = customers.map(el => {
    const findInvoiceSum = invoices?.find(inv => inv.customerId === el.id);
    const findVoucherSum = vouchers?.find(vou => vou.customerId === el.id);

    return {
      ...el,
      quantity: findInvoiceSum?._sum?.totalQty || 0,
      amount: findInvoiceSum?._sum?.amount || 0,
      paidAmount: findInvoiceSum?._sum?.paidAmount || 0,
      receiveAmount: findVoucherSum?._sum?.amount || 0,
      lastPaymentDate: findVoucherSum?._max?.date,
      lastSaleDate: findInvoiceSum?._max?.date,
      differentAmount:
        (findVoucherSum?._sum?.amount || 0) -
        (findInvoiceSum?._sum?.paidAmount || 0),
      dueDifferent:
        (findInvoiceSum?._sum?.amount || 0) -
        (findInvoiceSum?._sum?.paidAmount || 0),
    };
  });

  return result;
};

// get dashboard data
const dashboardData = async (
  distributorId: string
): Promise<IDistDashboardResponse> => {
  // find invoices
  const buyInvoices = await prisma.invoice.aggregate({
    where: { customerId: distributorId },
    _sum: { totalQty: true, amount: true, paidAmount: true },
  });

  const saleInvoices = await prisma.distInvoice.aggregate({
    where: { customer: { distributorId: distributorId } },
    _sum: {
      totalQty: true,
      amount: true,
      paidAmount: true,
    },
  });

  // find vouchers
  const buyVouchers = await prisma.voucher.aggregate({
    where: { customerId: distributorId },
    _sum: {
      amount: true,
    },
  });

  const saleVouchers = await prisma.distVoucher.aggregate({
    where: { customer: { distributorId: distributorId } },
    _sum: {
      amount: true,
    },
  });

  // find expenses
  const expenses = await prisma.distExpense.aggregate({
    where: { distributorId: distributorId },
    _sum: { amount: true },
  });

  // set voucher and invoices in customer
  const result = {
    buyQuantity: buyInvoices._sum.totalQty || 0,
    buyAmount: buyInvoices._sum.amount || 0,
    buyPaidAmount: buyInvoices._sum.paidAmount || 0,
    buyVoucherAmount: buyVouchers._sum.amount || 0,
    saleQuantity: saleInvoices._sum.totalQty || 0,
    saleAmount: saleInvoices._sum.amount || 0,
    salePaidAmount: saleInvoices._sum.paidAmount || 0,
    saleVoucherAmount: saleVouchers._sum.amount || 0,
    expense: expenses._sum.amount || 0,
  };

  return result;
};

export const DistReportService = {
  dueReport,
  advanceReport,
  summary,
  vendorDueAdvanced,
  dashboardData,
};
