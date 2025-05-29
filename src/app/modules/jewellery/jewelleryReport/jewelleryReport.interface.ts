import { JewelleryCategory } from '@prisma/client';

export type IJewelleryReportFilters = {
  date?: string;
  category?: string;
  jewelleryTypeId?: string;
  caratId?: string;
  vendorId?: string;
  year?: string;
  isSold?: string;
  isExchanged?: string;
};

export type IJewellerySummary = {
  category: JewelleryCategory;
  weight: number;
  price: number;
};

export type ICaratWiseSummary = {
  category: string;
  carats: {
    carat: string | undefined;
    weight: number;
    price: number;
  }[];
};

export type ITypeWiseSummary = {
  category: string;
  weight: number;
  types: {
    type: string | undefined;
    weight: number;
    carats: {
      carat: string | undefined;
      weight: number;
    }[];
  }[];
};

export type IJewelleryZakat = {
  category: string;
  carats: {
    carat: string | undefined;
    unitPrice: number;
    weight: number;
    price: number;
  }[];
};
