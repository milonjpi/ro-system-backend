import { z } from 'zod';
import { jewelleryCategory } from '../jewellery/jewellery.constant';

const create = z.object({
  body: z.object({
    label: z.string({ required_error: 'Carat is Required' }),
    category: z.enum(jewelleryCategory as [string, ...string[]], {
      required_error: 'Category is Required',
    }),
  }),
});

const update = z.object({
  body: z.object({
    label: z.string().optional(),
    category: z.enum(jewelleryCategory as [string, ...string[]]).optional(),
  }),
});

export const CaratValidation = {
  create,
  update,
};
