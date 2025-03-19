import { MonthlyExpense } from '@prisma/client';

export type IMonthlyExpenseFilters = {
  searchTerm?: string;
  year?: string;
  month?: string;
  startDate?: string;
  endDate?: string;
  expenseAreaId?: string;
  vehicleId?: string;
  monthlyExpenseHeadId?: string;
  paymentSourceId?: string;
};

type ISum = {
  _sum: {
    amount: number | null;
  };
};
export type IMonthlyExpenseResponse = {
  data: MonthlyExpense[];
  sum: ISum;
};
