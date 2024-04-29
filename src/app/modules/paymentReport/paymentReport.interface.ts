import { Vendor } from '@prisma/client';

export type IPaymentDueFilters = {
  startDate?: string;
  endDate?: string;
};

type IPaymentDueBill = {
  amount: number | null | undefined;
  paidAmount: number | null | undefined;
  lastPaymentDate: Date | null | undefined;
  lastBillDate: Date | null | undefined;
  differentAmount: number | null | undefined;
};

// advance types
type IPaymentAdvanceBill = {
  amount: number | null | undefined;
  paidAmount: number | null | undefined;
  paymentAmount: number | null | undefined;
  lastPaymentDate: Date | null | undefined;
  lastBillDate: Date | null | undefined;
  differentAmount: number | null | undefined;
};

export type IPaymentDueReport = Vendor | IPaymentDueBill;
export type IPaymentAdvanceReport = Vendor | IPaymentAdvanceBill;
