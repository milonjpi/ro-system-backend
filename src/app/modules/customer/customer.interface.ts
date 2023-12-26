import { Customer } from '@prisma/client';

export type ICustomerFilters = {
  searchTerm?: string;
  forVoucher?: string;
  isActive?: string;
};

export type IInvoiceDetails = {
  invoices: {
    saleAmount: number | null | undefined;
    paidAmount: number | null | undefined;
    voucherAmount: number | null | undefined;
    lastPaymentDate: Date | null | undefined;
    lastSaleDate: Date | null | undefined;
  };
};

export type ICustomerDetails = Customer | IInvoiceDetails;
