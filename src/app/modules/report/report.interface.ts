import { Customer } from '@prisma/client';

export type IDueFilters = {
  customerId?: string;
  startDate?: string;
  endDate?: string;
  minDue?: string;
  maxDue?: string;
};

export type IDueInvoice = {
  invoices: {
    amount: number | null | undefined;
    paidAmount: number | null | undefined;
    lastPaymentDate: Date | null | undefined;
    lastSaleDate: Date | null | undefined;
  };
};

export type IAdvanceInvoice = {
  invoices: {
    amount: number | null | undefined;
    paidAmount: number | null | undefined;
    receiveAmount: number | null | undefined;
    lastPaymentDate: Date | null | undefined;
    lastSaleDate: Date | null | undefined;
  };
};

export type IDueReport = Customer | IDueInvoice;
export type IAdvanceReport = Customer | IAdvanceInvoice;
