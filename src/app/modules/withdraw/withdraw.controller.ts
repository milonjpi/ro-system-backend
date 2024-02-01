import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { WithdrawService } from './withdraw.service';
import { Withdraw } from '@prisma/client';
import { withdrawFilterableFields } from './withdraw.constant';
import { IWithdrawResponse } from './withdraw.interface';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await WithdrawService.insertIntoDB(data);

  sendResponse<Withdraw>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Withdraw Created Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, withdrawFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await WithdrawService.getAll(filters, paginationOptions);

  sendResponse<IWithdrawResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Withdraws retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await WithdrawService.getSingle(id);

  sendResponse<Withdraw>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Withdraw retrieved successfully',
    data: result,
  });
});

// update single
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await WithdrawService.updateSingle(id, data);

  sendResponse<Withdraw>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Withdraw Updated Successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await WithdrawService.deleteFromDB(id);

  sendResponse<Withdraw>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Withdraw Deleted successfully',
    data: result,
  });
});

export const WithdrawController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
