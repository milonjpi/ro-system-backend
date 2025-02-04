import { z } from 'zod';

const create = z.object({
  body: z.object({
    expenseId: z.string({ required_error: 'Expense ID is Required' }),
    date: z.string({ required_error: 'Date is Required' }),
    paymentMethodId: z.string({
      required_error: 'Payment Method ID is Required',
    }),
    paymentDetails: z.string().optional().nullable(),
    amount: z.number({ required_error: 'Amount is Required' }),
  }),
});

const update = z.object({
  body: z.object({
    expenseId: z.string().optional(),
    date: z.string().optional(),
    paymentMethodId: z.string().optional(),
    paymentDetails: z.string().optional().nullable(),
    amount: z.number().optional(),
  }),
});

export const BuildingPaymentValidation = {
  create,
  update,
};
