import { BuildingExpense } from '@prisma/client';

export type IBuildingExpenseFilters = {
  searchTerm?: string;
  expenseHeadId?: string;
  vendorId?: string;
  brandId?: string;
  uomId?: string;
  startDate?: string;
  endDate?: string;
};

type ISum = {
  _sum: {
    quantity: number | null;
    amount: number | null;
    paidAmount: number | null;
  };
  _avg: {
    unitPrice: number | null;
  };
};
export type IBuildingExpenseResponse = {
  data: BuildingExpense[];
  sum: ISum;
};
