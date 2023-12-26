import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { CustomerService } from './customer.service';
import { Customer } from '@prisma/client';
import { customerFilterableFields } from './customer.constant';
import { ICustomerDetails } from './customer.interface';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await CustomerService.insertIntoDB(data);

  sendResponse<Customer>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Customer Created Successfully',
    data: result,
  });
});

// create
const insertIntoDBAll = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await CustomerService.insertIntoDBAll(data?.data);

  sendResponse<string>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Customer Created Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, customerFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await CustomerService.getAll(filters, paginationOptions);

  sendResponse<Customer[]>(res, {
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

  const result = await CustomerService.getSingle(id);

  sendResponse<Customer>(res, {
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

  const result = await CustomerService.updateSingle(id, data);

  sendResponse<Customer>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Customer Updated Successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await CustomerService.deleteFromDB(id);

  sendResponse<Customer>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Customer Deleted successfully',
    data: result,
  });
});

// set voucher and invoices in customer
const getCustomerDetails = catchAsync(async (req: Request, res: Response) => {
  const result = await CustomerService.getCustomerDetails();

  sendResponse<ICustomerDetails[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Customers retrieved successfully',
    data: result,
  });
});

export const CustomerController = {
  insertIntoDB,
  insertIntoDBAll,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
  getCustomerDetails,
};
