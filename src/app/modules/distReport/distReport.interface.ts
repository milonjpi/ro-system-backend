import { DistClient } from '@prisma/client';

// due types
export type IDistDueFilters = {
  startDate?: string;
  endDate?: string;
  distributorId?: string;
};

type IDueInvoice = {
  amount: number | null | undefined;
  paidAmount: number | null | undefined;
  lastPaymentDate: Date | null | undefined;
  lastSaleDate: Date | null | undefined;
  differentAmount: number | null | undefined;
};

// advance types
type IAdvanceInvoice = {
  quantity?: number | null | undefined;
  amount: number | null | undefined;
  paidAmount: number | null | undefined;
  receiveAmount: number | null | undefined;
  lastPaymentDate: Date | null | undefined;
  lastSaleDate: Date | null | undefined;
  differentAmount?: number | null | undefined;
  dueDifferent?: number | null | undefined;
};

export type IDistDueReport = DistClient | IDueInvoice;
export type IDistAdvanceReport = DistClient | IAdvanceInvoice;

// summary types
export type IDistProductSum = {
  year: string;
  month: string;
  productId: string;
  quantity: number;
};

export type IDistInvoiceSummary = {
  year: string;
  month: string;
  totalQty: number;
  totalPrice: number;
  discount: number;
  amount: number;
  paidAmount: number;
  products: IDistProductSum[];
};

// dashboard
export type IDistDashboardResponse = {
  buyQuantity: number;
  buyAmount: number;
  buyPaidAmount: number;
  buyVoucherAmount: number;
  saleQuantity: number;
  saleAmount: number;
  salePaidAmount: number;
  saleVoucherAmount: number;
  expense: number;
};
