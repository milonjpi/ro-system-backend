import { z } from 'zod';

const create = z.object({
  body: z.object({
    date: z.string({ required_error: 'Date is Required' }),
    investmentSourceId: z.string({
      required_error: 'Investment Source ID is Required',
    }),
    amount: z.number({ required_error: 'Amount is Required' }),
    investmentDetails: z.string({
      required_error: 'Investment Details is Required',
    }),
    remarks: z.string().optional().nullable(),
  }),
});

const update = z.object({
  body: z.object({
    date: z.string().optional(),
    investmentSourceId: z.string().optional(),
    amount: z.number().optional(),
    investmentDetails: z.string().optional(),
    remarks: z.string().optional().nullable(),
  }),
});

export const BuildingInvestmentValidation = {
  create,
  update,
};
