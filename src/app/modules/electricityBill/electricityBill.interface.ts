import { ElectricityBill } from '@prisma/client';

export type IElectricityBillFilters = {
  searchTerm?: string;
  meterId?: string;
  year?: string;
  month?: string;
  status?: string;
};

type ISum = {
  _sum: {
    amount: number | null;
    unit: number | null;
  };
};
export type IElectricityBillResponse = {
  data: ElectricityBill[];
  sum: ISum;
};

export type IElectricMonthSummary = Pick<ElectricityBill, 'month'> & ISum;
export type IElectricYearSummary = Pick<ElectricityBill, 'meterId' | 'year'> &
  ISum;
