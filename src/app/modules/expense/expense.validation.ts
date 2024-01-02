import { z } from 'zod';

const create = z.object({
  body: z.object({
    date: z.string({ required_error: 'Date is Required' }),
    expenseHeadId: z.string({ required_error: 'Expense head is Required' }),
    vendorId: z.string().optional(),
    amount: z.number({ required_error: 'Amount is Required' }),
    remarks: z.string().optional(),
  }),
});

const update = z.object({
  body: z.object({
    date: z.string().optional(),
    expenseHeadId: z.string().optional(),
    vendorId: z.string().optional(),
    amount: z.number().optional(),
    remarks: z.string().optional(),
  }),
});

export const ExpenseValidation = {
  create,
  update,
};
