import { z } from 'zod';

const create = z.object({
  body: z.object({
    label: z.string({ required_error: 'Source is Required' }),
    description: z.string().optional().nullable(),
  }),
});

const update = z.object({
  body: z.object({
    label: z.string({ required_error: 'Source is Required' }),
    description: z.string().optional().nullable(),
  }),
});

export const SourceValidation = {
  create,
  update,
};
