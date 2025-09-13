import { Expense, ExpenseHead } from '@prisma/client';

export type IExpenseFilters = {
  searchTerm?: string;
  startDate?: string;
  endDate?: string;
  vendorId?: string;
  expenseHeadId?: string;
  userId?: string;
};

type ISum = {
  _sum: {
    amount: number | null;
  };
};
export type IExpenseResponse = {
  data: Expense[];
  sum: ISum;
};

// expense summary
export type IExpenseHeadSummary = {
  expenseHead: ExpenseHead | undefined;
  amount: number;
};
