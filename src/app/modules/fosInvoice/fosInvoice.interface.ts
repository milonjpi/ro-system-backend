import { FosInvoice } from '@prisma/client';

export type IFosInvoiceFilters = {
  searchTerm?: string;
  startDate?: string;
  endDate?: string;
  fosCustomerId?: string;
  userId?: string;
};

type ISum = {
  _sum: {
    totalQty: number | null;
  };
};

export type IFosInvoiceResponse = {
  data: FosInvoice[];
  sum: ISum;
};
