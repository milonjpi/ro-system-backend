import {
  ExpenseArea,
  MonthlyExpense,
  MonthlyExpenseHead,
  PaymentSource,
} from '@prisma/client';

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

// result
export type IAreaWiseResponse = {
  expenseArea: ExpenseArea | undefined;
  month: string;
  amount: number;
};

export type IAreaWiseDashResponse = {
  expenseArea: string;
  amount: number;
};

export type IHeadWiseResponse = {
  expenseHead: MonthlyExpenseHead | undefined;
  month: string;
  amount: number;
};

export type IHeadWiseDashResponse = {
  expenseHead: string;
  amount: number;
};

export type ISourceWiseResponse = {
  paymentSource: PaymentSource | undefined;
  month: string;
  amount: number;
};
