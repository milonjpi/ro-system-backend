import {
  IAdvanceReport,
  IBalanceSheet,
  IDailyReport,
  IDailyReportFilters,
  IDonationFilters,
  IDonationReport,
  IDueFilters,
  IDueReport,
  IInvoiceSummary,
  IProductSum,
} from './report.interface';
import prisma from '../../../shared/prisma';
import { Prisma } from '@prisma/client';

// get due report
const dueReport = async (filters: IDueFilters): Promise<IDueReport[]> => {
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
  const whereConditions: Prisma.InvoiceWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};
  // find invoices
  const invoices = await prisma.invoice.groupBy({
    where: whereConditions,
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

const balanceSheet = async (): Promise<IBalanceSheet> => {
  // invoices
  const invoices = await prisma.invoice.aggregate({
    _sum: {
      amount: true,
      paidAmount: true,
    },
  });

  // bills
  const bills = await prisma.bill.aggregate({
    _sum: {
      amount: true,
      paidAmount: true,
    },
  });

  // equipment in
  const equipmentIn = await prisma.equipmentIn.groupBy({
    by: 'equipmentId',
    _sum: {
      totalPrice: true,
      quantity: true,
    },
    _avg: {
      unitPrice: true,
    },
  });

  // equipment out
  const equipmentOut = await prisma.equipmentOut.groupBy({
    by: 'equipmentId',
    _sum: {
      quantity: true,
    },
  });

  // expenses
  const expenses = await prisma.expense.groupBy({
    by: 'expenseHeadId',
    _sum: {
      amount: true,
    },
  });

  // fixed asset
  const fixedAssets = await prisma.fixedAsset.aggregate({
    _sum: {
      amount: true,
    },
  });

  // investment
  const investments = await prisma.investment.groupBy({
    by: 'isCash',
    _sum: {
      amount: true,
    },
  });

  // withdraw
  const withdraws = await prisma.withdraw.aggregate({
    _sum: {
      amount: true,
    },
  });

  // vouchers
  const vouchers = await prisma.voucher.groupBy({
    by: 'type',
    _sum: {
      amount: true,
    },
  });

  return {
    invoices,
    bills,
    equipmentIn,
    equipmentOut,
    expenses,
    fixedAssets,
    investments,
    withdraws,
    vouchers,
  };
};

// get due report
const donationReport = async (
  filters: IDonationFilters
): Promise<IDonationReport[]> => {
  const { startDate, endDate } = filters;

  const andConditions = [];

  andConditions.push({ amount: 0 });

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
  // find invoices
  const invoices = await prisma.invoice.groupBy({
    where: whereConditions,
    by: ['customerId'],
    _sum: {
      totalQty: true,
    },
  });

  // customers
  const customers = await prisma.customer.findMany({
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
  const result = invoices
    .map(el => {
      const findCustomer = customers?.find(cm => cm.id === el.customerId);

      return {
        ...findCustomer,
        quantity: el?._sum?.totalQty || 0,
      };
    })
    .sort((a, b) => b.quantity - a.quantity);

  return result;
};

// get daily report
const dailyReport = async (
  filters: IDailyReportFilters
): Promise<IDailyReport> => {
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

  const whereConditions: Prisma.InvoiceWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const voucherWhereConditions: Prisma.VoucherWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const expenseWhereConditions: Prisma.ExpenseWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const investmentWhereConditions: Prisma.InvestmentWhereInput =
    andConditions.length > 0
      ? { AND: andConditions, isCash: true }
      : { isCash: true };

  const withdrawWhereConditions: Prisma.WithdrawWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};
  // find invoices
  const invoices = await prisma.invoice.aggregate({
    where: whereConditions,
    _sum: {
      amount: true,
      paidAmount: true,
      totalQty: true,
    },
  });

const invoicedProducts = await prisma.$queryRaw`SELECT
  ip."productId",
  SUM(ip.quantity) AS quantity,
  SUM(ip."totalPrice") AS "totalPrice"
FROM invoices i
JOIN "invoicedProducts" ip ON i.id = ip."invoiceId"
WHERE i.date BETWEEN ${new Date(`${startDate}, 00:00:00`)} AND ${new Date(
  `${endDate}, 23:59:59`
)}
GROUP BY  ip."productId"
ORDER BY ip."productId"`;

// find vouchers
const vouchers = await prisma.voucher.groupBy({
  where: voucherWhereConditions,
  by: ['type'],
  _sum: {
    amount: true,
  },
});

// customers
const expenses = await prisma.expense.aggregate({
  where: expenseWhereConditions,
  _sum: {
    amount: true,
  },
});

const investments = await prisma.investment.aggregate({
  where: investmentWhereConditions,
  _sum: { amount: true },
});

const withdraws = await prisma.withdraw.aggregate({
  where: withdrawWhereConditions,
  _sum: { amount: true },
});

  return {
    invoices,
    invoicedProducts,
    vouchers,
    expenses,
    investments,
    withdraws,
  };
};

export const ReportService = {
  dueReport,
  advanceReport,
  summary,
  balanceSheet,
  donationReport,
  dailyReport,
};
