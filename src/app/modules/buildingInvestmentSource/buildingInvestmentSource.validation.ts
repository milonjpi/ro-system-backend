import { z } from 'zod';

const create = z.object({
  body: z.object({
    label: z.string({ required_error: 'Investment Source is Required' }),
  }),
});

const update = z.object({
  body: z.object({
    label: z.string({ required_error: 'Investment Source is Required' }),
  }),
});

export const BuildingInvestmentSourceValidation = {
  create,
  update,
};
