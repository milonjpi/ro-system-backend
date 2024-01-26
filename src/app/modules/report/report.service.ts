import { IAdvanceReport, IDueReport, ISummary } from './report.interface';
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
const summary = async (customerId: string | undefined): Promise<ISummary[]> => {
  const customer = customerId || '';

  const result = await prisma.$queryRaw`SELECT
  EXTRACT(YEAR FROM i.date) AS year,
  EXTRACT(MONTH FROM i.date) AS month,
  SUM(i."totalQty") AS "totalQty",
  SUM(i."totalPrice") AS "totalPrice",
  SUM(i.discount) AS discount,
  SUM(i.amount) AS amount,
  SUM(i."paidAmount") AS "paidAmount",
  ip."productId",
  SUM(ip.quantity) AS quantity
FROM invoices i
JOIN "invoicedProducts" ip ON i.id = ip."invoiceId"
WHERE i."customerId" LIKE ${`%${customer}%`}
GROUP BY year, month, ip."productId"
ORDER BY year, month, ip."productId"`;

  return result as ISummary[];
};

export const ReportService = {
  dueReport,
  advanceReport,
  summary,
};
