import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { AuthService } from './auth.service';
import { ILoginUserResponse, IRefreshTokenResponse } from './auth.interface';
import config from '../../../config';

// signIn
const signIn = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const result = await AuthService.signIn(data);

  const { refreshToken, ...others } = result;

  // set refresh token into cookie
  const cookieOptions = {
    secure: true,
    httpOnly: true,
    sameSite: 'none',
    maxAge: parseInt(config.jwt.cookie_max_age || '31536000000'),
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  res.cookie('tbzROToken', refreshToken, cookieOptions);

  sendResponse<ILoginUserResponse>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User sign in successfully!',
    data: others,
  });
});

// logout
const logout = catchAsync(async (req: Request, res: Response) => {
  res.clearCookie('tbzROToken');

  sendResponse<string>(res, {
    statusCode: 200,
    success: true,
    message: 'Logout successfully !',
    data: 'Logout successfully !',
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { tbzROToken } = req.cookies;

  const result = await AuthService.refreshToken(tbzROToken);

  sendResponse<IRefreshTokenResponse>(res, {
    statusCode: 200,
    success: true,
    message: 'Token Refreshed successfully !',
    data: result,
  });
});

export const AuthController = {
  signIn,
  logout,
  refreshToken,
};
