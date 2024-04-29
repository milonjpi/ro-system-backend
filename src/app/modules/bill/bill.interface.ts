import { Bill } from '@prisma/client';

export type IBillFilters = {
  searchTerm?: string;
  startDate?: string;
  endDate?: string;
  vendorId?: string;
  userId?: string;
  status?: string;
};

type ISum = {
  _sum: {
    totalPrice: number | null;
    discount: number | null;
    amount: number | null;
    paidAmount: number | null;
  };
};
export type IBillResponse = {
  data: Bill[];
  sum: ISum;
};
