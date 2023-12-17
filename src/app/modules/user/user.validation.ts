import { z } from 'zod';
import { userRoles } from './user.constant';

const create = z.object({
  body: z.object({
    fullName: z.string({
      required_error: 'Full Name is required',
    }),
    userName: z.string({
      required_error: 'User Name is required',
    }),
    password: z.string({
      required_error: 'Password is required',
    }),
    role: z.enum(userRoles as [string, ...string[]]).optional(),
    profileImg: z.string().optional(),
  }),
});

const update = z.object({
  body: z.object({
    fullName: z.string().optional(),
    userName: z.string().optional(),
    password: z.string().optional(),
    role: z.enum(userRoles as [string, ...string[]]).optional(),
    profileImg: z.string().optional().nullable(),
  }),
});

export const UserValidation = {
  create,
  update,
};
