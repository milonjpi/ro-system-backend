import { Withdraw } from '@prisma/client';

export type IWithdrawFilters = {
  searchTerm?: string;
  startDate?: string;
  endDate?: string;
};

export type IWithdrawResponse = {
  data: Withdraw[];
  sum: {
    _sum: {
      amount: number | null;
    };
  };
};
