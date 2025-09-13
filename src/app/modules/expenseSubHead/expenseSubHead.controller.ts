import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { ExpenseSubHeadService } from './expenseSubHead.service';
import { ExpenseSubHead } from '@prisma/client';
import { expenseSubHeadFilterableFields } from './expenseSubHead.constant';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await ExpenseSubHeadService.insertIntoDB(data);

  sendResponse<ExpenseSubHead>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Sub Head Created Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, expenseSubHeadFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await ExpenseSubHeadService.getAll(filters, paginationOptions);

  sendResponse<ExpenseSubHead[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Expense Sub Heads retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await ExpenseSubHeadService.getSingle(id);

  sendResponse<ExpenseSubHead>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Expense Sub Head retrieved successfully',
    data: result,
  });
});

// update single
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await ExpenseSubHeadService.updateSingle(id, data);

  sendResponse<ExpenseSubHead>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Sub Head Updated Successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await ExpenseSubHeadService.deleteFromDB(id);

  sendResponse<ExpenseSubHead>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Sub Head Deleted successfully',
    data: result,
  });
});

export const ExpenseSubHeadController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
