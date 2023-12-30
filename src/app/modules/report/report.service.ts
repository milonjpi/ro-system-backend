import { IAdvanceReport, IDueReport } from './report.interface';
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
      invoices: {
        amount: findInvoiceSum?._sum?.amount,
        paidAmount: findInvoiceSum?._sum?.paidAmount,
        lastPaymentDate: findVoucherSum?._max?.date,
        lastSaleDate: findInvoiceSum?._max?.date,
      },
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
      invoices: {
        amount: findInvoiceSum?._sum?.amount,
        paidAmount: findInvoiceSum?._sum?.paidAmount,
        receiveAmount: findVoucherSum?._sum?.amount,
        lastPaymentDate: findVoucherSum?._max?.date,
        lastSaleDate: findInvoiceSum?._max?.date,
      },
    };
  });

  return result;
};

export const ReportService = {
  dueReport,
  advanceReport,
};
