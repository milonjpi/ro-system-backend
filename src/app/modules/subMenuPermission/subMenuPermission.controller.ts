import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { SubMenuPermission } from '@prisma/client';
import { SubMenuPermissionService } from './subMenuPermission.service';

// add Sub Menu
const addSubMenu = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await SubMenuPermissionService.addSubMenu(data);

  sendResponse<SubMenuPermission>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Sub Menu Added Successfully',
    data: result,
  });
});

// remove Sub Menu
const removeSubMenu = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await SubMenuPermissionService.removeSubMenu(id);

  sendResponse<SubMenuPermission>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Sub Menu Removed successfully',
    data: result,
  });
});

export const SubMenuPermissionController = {
  addSubMenu,
  removeSubMenu,
};
