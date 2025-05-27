import { Jewellery } from '@prisma/client';

export type IJewelleryFilters = {
  searchTerm?: string;
  jewelleryTypeId?: string;
  caratId?: string;
  vendorId?: string;
  year?: string;
  month?: string;
  uomId?: string;
  isSold?: string;
  isExchanged?: string;
};

export type IJewelleryResponse = {
  data: Jewellery[];
  sum: {
    _sum: {
      weight: number | null;
      price: number | null;
    };
  };
};
