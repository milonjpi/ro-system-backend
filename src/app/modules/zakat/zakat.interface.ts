import { Zakat } from '@prisma/client';

export type IZakatFilters = {
  searchTerm?: string;
  year?: string;
  recipientId?: string;
};

type ISum = {
  _sum: {
    amount: number | null;
  };
};
export type IZakatResponse = {
  data: Zakat[];
  sum: ISum;
};
