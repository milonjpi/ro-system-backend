import { z } from 'zod';

const signIn = z.object({
  body: z.object({
    userName: z.string({ required_error: 'User Name is Required' }),
    password: z.string({ required_error: 'Password is Required' }),
  }),
});

const refreshTokenZodSchema = z.object({
  cookies: z.object({
    tbzROToken: z.string({
      required_error: 'Refresh Token is required',
    }),
  }),
});

export const AuthValidation = {
  signIn,
  refreshTokenZodSchema,
};
