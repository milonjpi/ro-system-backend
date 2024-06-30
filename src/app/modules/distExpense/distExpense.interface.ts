import { DistExpense } from '@prisma/client';

export type IDistExpenseFilters = {
  searchTerm?: string;
  startDate?: string;
  endDate?: string;
  distributorId?: string;
  expenseHeadId?: string;
  userId?: string;
};

type ISum = {
  _sum: {
    amount: number | null;
  };
};
export type IDistExpenseResponse = {
  data: DistExpense[];
  sum: ISum;
};
