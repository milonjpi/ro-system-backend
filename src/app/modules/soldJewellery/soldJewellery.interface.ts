import { SoldJewellery } from '@prisma/client';

export type ISoldJewelleryFilters = {
  searchTerm?: string;
  soldType?: string;
  category?: string;
  jewelleryTypeId?: string;
  jewelleryId?: string;
  vendorId?: string;
  year?: string;
  month?: string;
};

export type ISoldJewelleryResponse = {
  data: SoldJewellery[];
  sum: {
    _sum: {
      weight: number | null;
      price: number | null;
    };
  };
};
