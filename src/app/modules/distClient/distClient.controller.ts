import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { DistClientService } from './distClient.service';
import { DistClient } from '@prisma/client';
import { distClientFilterableFields } from './distClient.constant';
import { IDistClientDetails } from './distClient.interface';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await DistClientService.insertIntoDB(data);

  sendResponse<DistClient>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Customer Created Successfully',
    data: result,
  });
});

// create
const insertIntoDBAll = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await DistClientService.insertIntoDBAll(data?.data);

  sendResponse<string>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Customers Created Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, distClientFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await DistClientService.getAll(filters, paginationOptions);

  sendResponse<DistClient[]>(res, {
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

  const result = await DistClientService.getSingle(id);

  sendResponse<DistClient>(res, {
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

  const result = await DistClientService.updateSingle(id, data);

  sendResponse<DistClient>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Customer Updated Successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await DistClientService.deleteFromDB(id);

  sendResponse<DistClient>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Customer Deleted successfully',
    data: result,
  });
});

// set voucher and invoices in distClient
const getDistClientDetails = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, distClientFilterableFields);
  const result = await DistClientService.getDistClientDetails(filters);

  sendResponse<IDistClientDetails[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Customers retrieved successfully',
    data: result,
  });
});

export const DistClientController = {
  insertIntoDB,
  insertIntoDBAll,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
  getDistClientDetails,
};
