import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { ExpenseService } from './expense.service';
import { Expense, UserRole } from '@prisma/client';
import { expenseFilterableFields } from './expense.constant';
import { IExpenseHeadSummary, IExpenseResponse } from './expense.interface';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const user = req.user as { id: string; role: UserRole };

  data.userId = user.id;

  const result = await ExpenseService.insertIntoDB(data);

  sendResponse<Expense>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Expense Created Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, expenseFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await ExpenseService.getAll(filters, paginationOptions);

  sendResponse<IExpenseResponse>(res, {
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

  const result = await ExpenseService.getSingle(id);

  sendResponse<Expense>(res, {
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

  const result = await ExpenseService.updateSingle(id, data);

  sendResponse<Expense>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Expense Updated Successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await ExpenseService.deleteFromDB(id);

  sendResponse<Expense>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Expense Deleted successfully',
    data: result,
  });
});

// get expense head summary
const expenseHeadSummary = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, expenseFilterableFields);
  const result = await ExpenseService.expenseHeadSummary(filters);

  sendResponse<IExpenseHeadSummary[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Expenses retrieved successfully',
    data: result,
  });
});


export const ExpenseController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
  expenseHeadSummary,
};
