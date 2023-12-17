import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { SectionPermission } from '@prisma/client';
import { SectionPermissionService } from './sectionPermission.service';

// add section
const addSection = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await SectionPermissionService.addSection(data);

  sendResponse<SectionPermission>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Section Added Successfully',
    data: result,
  });
});

// remove Section
const removeSection = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await SectionPermissionService.removeSection(id);

  sendResponse<SectionPermission>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Section Removed successfully',
    data: result,
  });
});

export const SectionPermissionController = {
  addSection,
  removeSection,
};
