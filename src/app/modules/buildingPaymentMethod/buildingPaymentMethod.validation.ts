import { z } from 'zod';

const create = z.object({
  body: z.object({
    label: z.string({ required_error: 'Payment Method is Required' }),
  }),
});

const update = z.object({
  body: z.object({
    label: z.string({ required_error: 'Payment Method is Required' }),
  }),
});

export const BuildingPaymentMethodValidation = {
  create,
  update,
};
