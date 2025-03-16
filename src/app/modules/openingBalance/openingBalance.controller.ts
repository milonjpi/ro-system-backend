import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { OpeningBalanceService } from './openingBalance.service';
import { OpeningBalance } from '@prisma/client';
import { openingBalanceFilterableFields } from './openingBalance.constant';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await OpeningBalanceService.insertIntoDB(data);

  sendResponse<OpeningBalance>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Opening Balance Created Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, openingBalanceFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await OpeningBalanceService.getAll(filters, paginationOptions);

  sendResponse<OpeningBalance[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Opening Balances retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await OpeningBalanceService.getSingle(id);

  sendResponse<OpeningBalance>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Opening Balance retrieved successfully',
    data: result,
  });
});

// update single
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await OpeningBalanceService.updateSingle(id, data);

  sendResponse<OpeningBalance>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Opening Balance Updated Successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await OpeningBalanceService.deleteFromDB(id);

  sendResponse<OpeningBalance>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Opening Balance Deleted successfully',
    data: result,
  });
});

export const OpeningBalanceController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
