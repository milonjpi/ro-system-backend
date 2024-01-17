import { Invoice, Voucher, VoucherDetail } from '@prisma/client';

export type IVoucherFilters = {
  searchTerm?: string;
  startDate?: string;
  endDate?: string;
  customerId?: string;
  vendorId?: string;
  userId?: string;
  type?: string;
};

export type IVoucherDetail = {
  voucherId: string;
  invoiceId: string;
  receiveAmount: number;
};

type ISum = {
  _sum: {
    amount: number | null;
  };
};

type IVoucherSum = Pick<Voucher, 'accountHeadId'> & ISum;

export type IVoucherResponse = {
  data: Voucher[];
  sum: IVoucherSum[];
};

export type CustomVoucherDetails = VoucherDetail & { invoice: Invoice };
