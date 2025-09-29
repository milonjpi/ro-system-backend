import { ElectricityBill } from '@prisma/client';

export type IElectricityBillFilters = {
  searchTerm?: string;
  smsAccount?: string;
  meterId?: string;
  year?: string;
  month?: string;
  status?: string;
};

type ISum = {
  _sum: {
    unit: number | null;
    netBill: number | null;
    serviceCharge: number | null;
    amount: number | null;
  };
};
export type IElectricityBillResponse = {
  data: ElectricityBill[];
  sum: ISum;
};

export type IElectricMonthSummary = Pick<ElectricityBill, 'month'> & ISum;
export type IElectricYearSummary = Pick<ElectricityBill, 'meterId' | 'year'> &
  ISum;

export type IBillGroupResponse = {
  data: {
    year: string;
    month: string;
    code: number;
    data: ElectricityBill[];
  }[];
  sum: ISum;
};
