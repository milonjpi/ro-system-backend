import { Vendor } from '@prisma/client';

export type IVendorFilters = {
  searchTerm?: string;
  forVoucher?: string;
  isActive?: string;
};

export type IBillDetails = {
  bills: {
    buyAmount: number | null | undefined;
    paidAmount: number | null | undefined;
    voucherAmount: number | null | undefined;
    lastPaymentDate: Date | null | undefined;
    lastBuyDate: Date | null | undefined;
  };
};

export type IVendorDetails = Vendor | IBillDetails;
