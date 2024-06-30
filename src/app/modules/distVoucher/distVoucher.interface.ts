import { DistInvoice, DistVoucher, DistVoucherDetail } from '@prisma/client';

export type IDistVoucherFilters = {
  searchTerm?: string;
  startDate?: string;
  endDate?: string;
  distributorId?: string;
  customerId?: string;
  vendorId?: string;
  userId?: string;
  type?: string;
  report?: string;
};

export type IDistVoucherDetail = {
  voucherId: string;
  invoiceId: string;
  receiveAmount: number;
};

type ISum = {
  _sum: {
    amount: number | null;
  };
};

export type IDistVoucherResponse = {
  data: DistVoucher[];
  sum: ISum;
};

export type CustomDistVoucherDetails = DistVoucherDetail & {
  invoice: DistInvoice;
};
