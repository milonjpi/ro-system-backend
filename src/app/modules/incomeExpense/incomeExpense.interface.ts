import { IncomeExpense } from '@prisma/client';

export type IIncomeExpenseFilters = {
  searchTerm?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  incomeExpenseHeadId?: string;
  modeOfPaymentId?: string;
};

type ISum = {
  _sum: {
    amount: number | null;
  };
};

export type IIncomeExpenseResponse = {
  data: IncomeExpense[];
  sum: ISum;
};
