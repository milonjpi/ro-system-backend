import { SoldJewellery } from '@prisma/client';

export type ISoldJewelleryFilters = {
  searchTerm?: string;
  soldType?: string;
  category?: string;
  jewelleryTypeId?: string;
  jewelleryId?: string;
  year?: string;
  month?: string;
};

export type ISoldJewelleryResponse = {
  data: SoldJewellery[];
  sum: {
    _avg: {
      unitPrice: number | null;
    };
    _sum: {
      weight: number | null;
      totalPrice: number | null;
      deduction: number | null;
      price: number | null;
    };
  };
};
