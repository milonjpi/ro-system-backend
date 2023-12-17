import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { AccountTypeService } from './accountType.service';
import { AccountType } from '@prisma/client';
import { accountTypeFilterableFields } from './accountType.constant';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await AccountTypeService.insertIntoDB(data);

  sendResponse<AccountType>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Account Type Created Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, accountTypeFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await AccountTypeService.getAll(filters, paginationOptions);

  sendResponse<AccountType[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Account Types retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await AccountTypeService.getSingle(id);

  sendResponse<AccountType>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Account Type retrieved successfully',
    data: result,
  });
});

// update single
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await AccountTypeService.updateSingle(id, data);

  sendResponse<AccountType>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Account Type Updated Successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await AccountTypeService.deleteFromDB(id);

  sendResponse<AccountType>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Account Type Deleted successfully',
    data: result,
  });
});

export const AccountTypeController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
