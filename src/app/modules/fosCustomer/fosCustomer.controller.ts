import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { FosCustomerService } from './fosCustomer.service';
import { FosCustomer } from '@prisma/client';
import { fosCustomerFilterableFields } from './fosCustomer.constant';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await FosCustomerService.insertIntoDB(data);

  sendResponse<FosCustomer>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Customer Created Successfully',
    data: result,
  });
});

// create
const insertIntoDBAll = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await FosCustomerService.insertIntoDBAll(data?.data);

  sendResponse<string>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Customer Created Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, fosCustomerFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await FosCustomerService.getAll(filters, paginationOptions);

  sendResponse<FosCustomer[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Customers retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await FosCustomerService.getSingle(id);

  sendResponse<FosCustomer>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Customer retrieved successfully',
    data: result,
  });
});

// update single
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await FosCustomerService.updateSingle(id, data);

  sendResponse<FosCustomer>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Customer Updated Successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await FosCustomerService.deleteFromDB(id);

  sendResponse<FosCustomer>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Customer Deleted successfully',
    data: result,
  });
});

export const FosCustomerController = {
  insertIntoDB,
  insertIntoDBAll,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
