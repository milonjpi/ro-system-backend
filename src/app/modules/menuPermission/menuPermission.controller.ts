import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { MenuPermission } from '@prisma/client';
import { MenuPermissionService } from './menuPermission.service';

// add Menu
const addMenu = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await MenuPermissionService.addMenu(data);

  sendResponse<MenuPermission>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Menu Added Successfully',
    data: result,
  });
});

// remove Menu
const removeMenu = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await MenuPermissionService.removeMenu(id);

  sendResponse<MenuPermission>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Menu Removed successfully',
    data: result,
  });
});

export const MenuPermissionController = {
  addMenu,
  removeMenu,
};
