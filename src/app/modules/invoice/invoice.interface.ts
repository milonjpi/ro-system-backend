import { Invoice } from '@prisma/client';

export type IInvoiceFilters = {
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

type IInvoiceSum = Pick<Invoice, 'accountHeadId'> & ISum;

export type IInvoiceResponse = {
  data: Invoice[];
  sum: IInvoiceSum[];
};
