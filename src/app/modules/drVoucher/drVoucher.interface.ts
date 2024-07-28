import { DrInvoice, DrVoucher, DrVoucherDetail } from '@prisma/client';

export type IDrVoucherFilters = {
  searchTerm?: string;
  startDate?: string;
  endDate?: string;
  customerId?: string;
  userId?: string;
  report?: string;
};

export type IDrVoucherDetail = {
  voucherId: string;
  invoiceId: string;
  receiveAmount: number;
};

type ISum = {
  _sum: {
    amount: number | null;
  };
};

export type IDrVoucherResponse = {
  data: DrVoucher[];
  sum: ISum;
};

export type CustomDrVoucherDetails = DrVoucherDetail & {
  invoice: DrInvoice;
};
