import { z } from 'zod';

const create = z.object({
  body: z.object({
    date: z.string({ required_error: 'Date is Required' }),
    expenseHeadId: z.string({ required_error: 'Expense head is Required' }),
    vendorId: z.string().optional().nullable(),
    amount: z.number({ required_error: 'Amount is Required' }),
    expenseDetails: z.string().optional().nullable(),
    remarks: z.string().optional().nullable(),
  }),
});

const update = z.object({
  body: z.object({
    date: z.string().optional(),
    expenseHeadId: z.string().optional(),
    vendorId: z.string().optional().nullable(),
    amount: z.number().optional(),
    expenseDetails: z.string().optional().nullable(),
    remarks: z.string().optional().nullable(),
  }),
});

export const ExpenseValidation = {
  create,
  update,
};
