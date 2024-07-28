import { DrCustomer } from '@prisma/client';

export type IDrCustomerFilters = {
  searchTerm?: string;
  forVoucher?: string;
  isActive?: string;
};

export type IDrInvoiceDetails = {
  invoices: {
    saleAmount: number | null | undefined;
    paidAmount: number | null | undefined;
    voucherAmount: number | null | undefined;
    lastPaymentDate: Date | null | undefined;
    lastSaleDate: Date | null | undefined;
  };
};

export type IDrCustomerDetails = DrCustomer | IDrInvoiceDetails;
