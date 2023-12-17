import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { AccountHeadService } from './accountHead.service';
import { AccountHead } from '@prisma/client';
import { accountHeadFilterableFields } from './accountHead.constant';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await AccountHeadService.insertIntoDB(data);

  sendResponse<AccountHead>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Account Head Created Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, accountHeadFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await AccountHeadService.getAll(filters, paginationOptions);

  sendResponse<AccountHead[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Account Heads retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await AccountHeadService.getSingle(id);

  sendResponse<AccountHead>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Account Head retrieved successfully',
    data: result,
  });
});

// update single
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await AccountHeadService.updateSingle(id, data);

  sendResponse<AccountHead>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Account Head Updated Successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await AccountHeadService.deleteFromDB(id);

  sendResponse<AccountHead>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Account Head Deleted successfully',
    data: result,
  });
});

export const AccountHeadController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
