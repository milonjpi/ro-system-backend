import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { CustomerGroupService } from './customerGroup.service';
import { CustomerGroup } from '@prisma/client';
import { customerGroupFilterableFields } from './customerGroup.constant';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await CustomerGroupService.insertIntoDB(data);

  sendResponse<CustomerGroup>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Customer Group Created Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, customerGroupFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await CustomerGroupService.getAll(filters, paginationOptions);

  sendResponse<CustomerGroup[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Customer Groups retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await CustomerGroupService.getSingle(id);

  sendResponse<CustomerGroup>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Customer Group retrieved successfully',
    data: result,
  });
});

// update single
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await CustomerGroupService.updateSingle(id, data);

  sendResponse<CustomerGroup>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Customer Group Updated Successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await CustomerGroupService.deleteFromDB(id);

  sendResponse<CustomerGroup>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Customer Group Deleted successfully',
    data: result,
  });
});

export const CustomerGroupController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
