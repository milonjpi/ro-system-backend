import { ZakatValue } from '@prisma/client';

export type IZakatValueFilters = {
  year?: string;
};

type ISum = {
  _sum: {
    amount: number | null;
  };
};

export type ISingleZakatValue = {
  year: string;
  amount: number;
  paid: number;
};

export type IZakatValueResponse = {
  data: ZakatValue[];
  sum: ISum;
};
