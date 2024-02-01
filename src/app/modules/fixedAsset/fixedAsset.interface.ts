import { FixedAsset } from '@prisma/client';

export type IFixedAssetFilters = {
  searchTerm?: string;
  assetId?: string;
  startDate?: string;
  endDate?: string;
};

export type IFixedAssetResponse = {
  data: FixedAsset[];
  sum: {
    _sum: {
      amount: number | null;
    };
  };
};
