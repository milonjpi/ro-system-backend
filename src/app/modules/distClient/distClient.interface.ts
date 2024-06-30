import { DistClient } from '@prisma/client';

export type IDistClientFilters = {
  searchTerm?: string;
  distributorId?: string;
  forVoucher?: string;
  isActive?: string;
};

type IInvoiceDetails = {
  invoices: {
    saleAmount: number | null | undefined;
    paidAmount: number | null | undefined;
    voucherAmount: number | null | undefined;
    lastPaymentDate: Date | null | undefined;
    lastSaleDate: Date | null | undefined;
  };
};

export type IDistClientDetails = DistClient | IInvoiceDetails;
