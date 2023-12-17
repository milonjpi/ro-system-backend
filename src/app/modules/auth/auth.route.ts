import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthController } from './auth.controller';
import { AuthValidation } from './auth.validation';

const router = express.Router();


// user signUp
router.post(
  '/login',
  validateRequest(AuthValidation.signIn),
  AuthController.signIn
);

// logout
router.post(
  '/logout',
  validateRequest(AuthValidation.refreshTokenZodSchema),
  AuthController.logout
);

// refresh token
router.get(
  '/refresh-token',
  validateRequest(AuthValidation.refreshTokenZodSchema),
  AuthController.refreshToken
);

export const AuthRoutes = router;
