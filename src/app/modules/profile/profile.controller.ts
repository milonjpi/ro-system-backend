import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { User } from '@prisma/client';
import { ProfileService } from './profile.service';

// get profile
const getProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  const result = await ProfileService.getProfile(user?.id);

  sendResponse<User>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Profile retrieved successfully',
    data: result,
  });
});

export const ProfileController = {
  getProfile,
};
