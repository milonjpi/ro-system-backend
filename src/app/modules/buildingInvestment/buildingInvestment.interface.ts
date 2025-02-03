import { BuildingInvestment } from '@prisma/client';

export type IBuildingInvestmentFilters = {
  searchTerm?: string;
  investmentSourceId?: string;
  startDate?: string;
  endDate?: string;
};

type ISum = {
  _sum: {
    amount: number | null;
  };
};
export type IBuildingInvestmentResponse = {
  data: BuildingInvestment[];
  sum: ISum;
};
