import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { IncomeExpenseService } from './incomeExpense.service';
import { IncomeExpense } from '@prisma/client';
import {
  incomeExpenseFilterableFields,
  inExSummaryFilterableFields,
} from './incomeExpense.constant';
import {
  IIncomeExpenseResponse,
  IInExSummaryReport,
} from './incomeExpense.interface';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await IncomeExpenseService.insertIntoDB(data);

  sendResponse<IncomeExpense>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: `${result?.type} Created Successfully`,
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, incomeExpenseFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await IncomeExpenseService.getAll(filters, paginationOptions);

  sendResponse<IIncomeExpenseResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Income Expenses retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await IncomeExpenseService.getSingle(id);

  sendResponse<IncomeExpense>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `${result?.type} retrieved successfully`,
    data: result,
  });
});

// update single
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await IncomeExpenseService.updateSingle(id, data);

  sendResponse<IncomeExpense>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: `${result?.type} updated successfully`,
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await IncomeExpenseService.deleteFromDB(id);

  sendResponse<IncomeExpense>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `${result?.type} deleted successfully`,
    data: result,
  });
});

// get all
const getAllSummary = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, inExSummaryFilterableFields);

  const result = await IncomeExpenseService.getAllSummary(filters);

  sendResponse<IInExSummaryReport[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Income Expenses Summary retrieved successfully',
    data: result,
  });
});

export const IncomeExpenseController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
  getAllSummary,
};
