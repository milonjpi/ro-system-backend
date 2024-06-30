import { DistInvoice } from '@prisma/client';

export type IDistInvoiceFilters = {
  searchTerm?: string;
  startDate?: string;
  endDate?: string;
  customerId?: string;
  distributorId?: string;
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

export type IDistInvoiceResponse = {
  data: DistInvoice[];
  sum: ISum;
};
