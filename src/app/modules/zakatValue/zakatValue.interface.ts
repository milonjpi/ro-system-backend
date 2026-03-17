import { ZakatValue } from '@prisma/client';

export type IZakatValueFilters = {
  year?: string;
};

type ISum = {
  _sum: {
    amount: number | null;
  };
};

export type IZakatValueResponse = {
  data: ZakatValue[];
  sum: ISum;
};
