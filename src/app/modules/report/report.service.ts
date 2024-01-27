import {
  IAdvanceReport,
  IDueReport,
  IInvoiceSummary,
  IProductSum,
} from './report.interface';
import prisma from '../../../shared/prisma';

// get due report
const dueReport = async (): Promise<IDueReport[]> => {
  // find invoices
  const invoices = await prisma.invoice.groupBy({
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
  const vouchers = await prisma.voucher.groupBy({
    by: ['customerId'],
    _max: {
      date: true,
    },
  });

  // customers
  const customers = await prisma.customer.findMany({
    where: {
      isActive: true,
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
const advanceReport = async (): Promise<IAdvanceReport[]> => {
  // find invoices
  const invoices = await prisma.invoice.groupBy({
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
): Promise<IInvoiceSummary[]> => {
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
ORDER BY year, month`) as IInvoiceSummary[];

  const result2 = (await prisma.$queryRaw`SELECT
  EXTRACT(YEAR FROM i.date) AS year,
  EXTRACT(MONTH FROM i.date) AS month,
  ip."productId",
  SUM(ip.quantity) AS quantity
FROM invoices i
JOIN "invoicedProducts" ip ON i.id = ip."invoiceId"
WHERE i."customerId" LIKE ${`%${customer}%`}
GROUP BY year, month, ip."productId"
ORDER BY year, month, ip."productId"`) as IProductSum[];

  const finalResult = result?.map(el => ({
    ...el,
    products: result2,
  }));

  return finalResult;
};

export const ReportService = {
  dueReport,
  advanceReport,
  summary,
};
