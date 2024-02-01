import { Investment } from '@prisma/client';

export type IInvestmentFilters = {
  searchTerm?: string;
  startDate?: string;
  endDate?: string;
  isCash?: string;
};

export type IInvestmentResponse = {
  data: Investment[];
  sum: {
    _sum: {
      amount: number | null;
    };
  };
};
