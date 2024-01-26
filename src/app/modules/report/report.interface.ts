import { Customer } from '@prisma/client';

// due types
export type IDueFilters = {
  customerId?: string;
  startDate?: string;
  endDate?: string;
  minDue?: string;
  maxDue?: string;
};

export type IDueInvoice = {
  amount: number | null | undefined;
  paidAmount: number | null | undefined;
  lastPaymentDate: Date | null | undefined;
  lastSaleDate: Date | null | undefined;
  differentAmount: number | null | undefined;
};


// advance types
export type IAdvanceInvoice = {
  amount: number | null | undefined;
  paidAmount: number | null | undefined;
  receiveAmount: number | null | undefined;
  lastPaymentDate: Date | null | undefined;
  lastSaleDate: Date | null | undefined;
  differentAmount: number | null | undefined;
};

export type IDueReport = Customer | IDueInvoice;
export type IAdvanceReport = Customer | IAdvanceInvoice;


// summary types
export type ISummary = {
  year: string;
  month: string;
  totalQty: number;
  totalPrice: number;
  discount: number;
  amount: number;
  paidAmount: number;
  productId: string;
  quantity: number;
}
