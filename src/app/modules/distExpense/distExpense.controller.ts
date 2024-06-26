import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { DistExpenseService } from './distExpense.service';
import { DistExpense, UserRole } from '@prisma/client';
import { distExpenseFilterableFields } from './distExpense.constant';
import { IDistExpenseResponse } from './distExpense.interface';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const user = req.user as { id: string; role: UserRole };

  data.userId = user.id;

  const result = await DistExpenseService.insertIntoDB(data);

  sendResponse<DistExpense>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Expense Created Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, distExpenseFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await DistExpenseService.getAll(filters, paginationOptions);

  sendResponse<IDistExpenseResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Expenses retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await DistExpenseService.getSingle(id);

  sendResponse<DistExpense>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Expense retrieved successfully',
    data: result,
  });
});

// update single
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await DistExpenseService.updateSingle(id, data);

  sendResponse<DistExpense>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Expense Updated Successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await DistExpenseService.deleteFromDB(id);

  sendResponse<DistExpense>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Expense Deleted successfully',
    data: result,
  });
});

export const DistExpenseController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
