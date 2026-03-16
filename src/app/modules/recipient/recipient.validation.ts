import { z } from 'zod';

const create = z.object({
  body: z.object({
    fullName: z.string({ required_error: 'Name (BN) is Required' }),
    fullNameEn: z.string({ required_error: 'Name (EN) is Required' }),
    recipientGroupId: z.string().optional().nullable(),
    mobile: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
  }),
});

const update = z.object({
  body: z.object({
    fullName: z.string().optional(),
    fullNameEn: z.string().optional(),
    recipientGroupId: z.string().optional().nullable(),
    mobile: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
  }),
});

export const RecipientValidation = {
  create,
  update,
};
