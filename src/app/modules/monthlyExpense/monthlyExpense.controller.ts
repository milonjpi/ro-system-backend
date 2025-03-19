import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { MonthlyExpenseService } from './monthlyExpense.service';
import { MonthlyExpense } from '@prisma/client';
import { monthlyExpenseFilterableFields } from './monthlyExpense.constant';
import { IMonthlyExpenseResponse } from './monthlyExpense.interface';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const { data } = req.body;

  const result = await MonthlyExpenseService.insertIntoDB(data);

  sendResponse<string>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Expense Created Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, monthlyExpenseFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await MonthlyExpenseService.getAll(filters, paginationOptions);

  sendResponse<IMonthlyExpenseResponse>(res, {
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

  const result = await MonthlyExpenseService.getSingle(id);

  sendResponse<MonthlyExpense>(res, {
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

  const result = await MonthlyExpenseService.updateSingle(id, data);

  sendResponse<MonthlyExpense>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Expense Updated Successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await MonthlyExpenseService.deleteFromDB(id);

  sendResponse<MonthlyExpense>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Expense Deleted successfully',
    data: result,
  });
});

export const MonthlyExpenseController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
