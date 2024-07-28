import { DrInvoice } from '@prisma/client';

export type IDrInvoiceFilters = {
  searchTerm?: string;
  startDate?: string;
  endDate?: string;
  customerId?: string;
  userId?: string;
  status?: string;
  forVoucher?: string;
};

type ISum = {
  _sum: {
    totalQty: number | null;
    totalPrice: number | null;
    discount: number | null;
    amount: number | null;
    paidAmount: number | null;
  };
};

export type IDrInvoiceResponse = {
  data: DrInvoice[];
  sum: ISum;
};
