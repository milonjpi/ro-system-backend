import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { ExpenseHeadService } from './expenseHead.service';
import { ExpenseHead } from '@prisma/client';
import { expenseHeadFilterableFields } from './expenseHead.constant';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await ExpenseHeadService.insertIntoDB(data);

  sendResponse<ExpenseHead>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Expense Head Created Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, expenseHeadFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await ExpenseHeadService.getAll(filters, paginationOptions);

  sendResponse<ExpenseHead[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Expense Heads retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await ExpenseHeadService.getSingle(id);

  sendResponse<ExpenseHead>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Expense Head retrieved successfully',
    data: result,
  });
});

// update single
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await ExpenseHeadService.updateSingle(id, data);

  sendResponse<ExpenseHead>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Expense Head Updated Successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await ExpenseHeadService.deleteFromDB(id);

  sendResponse<ExpenseHead>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Expense Head Deleted successfully',
    data: result,
  });
});

export const ExpenseHeadController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
