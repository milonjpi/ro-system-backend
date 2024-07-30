import { DrCustomer } from '@prisma/client';

export type IDrSummaryReport =
  | DrCustomer
  | {
      totalQty: number;
      totalPrice: number;
      discount: number;
      amount: number;
      paidAmount: number;
    };
