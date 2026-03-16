import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { RecipientGroupService } from './recipientGroup.service';
import { RecipientGroup } from '@prisma/client';
import { recipientGroupFilterableFields } from './recipientGroup.constant';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await RecipientGroupService.insertIntoDB(data);

  sendResponse<RecipientGroup>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Recipient Group Created Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, recipientGroupFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await RecipientGroupService.getAll(filters, paginationOptions);

  sendResponse<RecipientGroup[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Recipient Groups retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await RecipientGroupService.getSingle(id);

  sendResponse<RecipientGroup>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Recipient Group retrieved successfully',
    data: result,
  });
});

// update single
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await RecipientGroupService.updateSingle(id, data);

  sendResponse<RecipientGroup>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Recipient Group Updated Successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await RecipientGroupService.deleteFromDB(id);

  sendResponse<RecipientGroup>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Recipient Group Deleted successfully',
    data: result,
  });
});

export const RecipientGroupController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
