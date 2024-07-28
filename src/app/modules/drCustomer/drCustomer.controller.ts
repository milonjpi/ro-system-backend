import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { DrCustomerService } from './drCustomer.service';
import { DrCustomer } from '@prisma/client';
import { drCustomerFilterableFields } from './drCustomer.constant';
import { IDrCustomerDetails } from './drCustomer.interface';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await DrCustomerService.insertIntoDB(data);

  sendResponse<DrCustomer>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Distributor Created Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, drCustomerFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await DrCustomerService.getAll(filters, paginationOptions);

  sendResponse<DrCustomer[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Distributors retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await DrCustomerService.getSingle(id);

  sendResponse<DrCustomer>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Distributor retrieved successfully',
    data: result,
  });
});

// update single
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await DrCustomerService.updateSingle(id, data);

  sendResponse<DrCustomer>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Distributor Updated Successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await DrCustomerService.deleteFromDB(id);

  sendResponse<DrCustomer>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Distributor Deleted successfully',
    data: result,
  });
});

// set voucher and invoices in drCustomer
const getDrCustomerDetails = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, drCustomerFilterableFields);
  const result = await DrCustomerService.getDrCustomerDetails(filters);

  sendResponse<IDrCustomerDetails[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Distributors retrieved successfully',
    data: result,
  });
});

export const DrCustomerController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
  getDrCustomerDetails,
};
