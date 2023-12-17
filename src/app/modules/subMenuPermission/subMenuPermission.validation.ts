import { z } from 'zod';

const create = z.object({
  body: z.object({
    userId: z.string({ required_error: 'User ID is Required' }),
    label: z.string({ required_error: 'Sub Menu is Required' }),
  }),
});

export const SubMenuPermissionValidation = {
  create,
};
