import { z } from 'zod';
import { zakatStatus } from './zakat.constant';

const create = z.object({
  body: z.object({
    year: z.string({ required_error: 'Year is Required' }),
    recipientId: z.string({ required_error: 'Recipient ID is Required' }),
    amount: z.number({ required_error: 'Amount is Required' }),
    status: z.enum(zakatStatus as [string, ...string[]]).optional(),
    remarks: z.string().optional().nullable(),
  }),
});

const update = z.object({
  body: z.object({
    year: z.string().optional(),
    recipientId: z.string().optional(),
    amount: z.number().optional(),
    status: z.enum(zakatStatus as [string, ...string[]]).optional(),
    remarks: z.string().optional().nullable(),
  }),
});

export const ZakatValidation = {
  create,
  update,
};
