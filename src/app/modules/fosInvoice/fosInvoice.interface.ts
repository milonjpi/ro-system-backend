import { FosCustomer, FosInvoice } from '@prisma/client';

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

// summary
export type IFosSummaryFilters = {
  startDate?: string;
  endDate?: string;
};

export type IFosSummaryReport = FosCustomer | { quantity: number };
