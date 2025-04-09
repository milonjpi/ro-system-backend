import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { ExpenseDetailService } from './expenseDetail.service';
import { ExpenseDetail } from '@prisma/client';
import { expenseDetailFilterableFields } from './expenseDetail.constant';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await ExpenseDetailService.insertIntoDB(data);

  sendResponse<ExpenseDetail>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Expense Detail Created Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, expenseDetailFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await ExpenseDetailService.getAll(filters, paginationOptions);

  sendResponse<ExpenseDetail[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Expense Details retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await ExpenseDetailService.getSingle(id);

  sendResponse<ExpenseDetail>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Expense Detail retrieved successfully',
    data: result,
  });
});

// update single
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await ExpenseDetailService.updateSingle(id, data);

  sendResponse<ExpenseDetail>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Expense Detail Updated Successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await ExpenseDetailService.deleteFromDB(id);

  sendResponse<ExpenseDetail>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Expense Detail Deleted successfully',
    data: result,
  });
});

export const ExpenseDetailController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
