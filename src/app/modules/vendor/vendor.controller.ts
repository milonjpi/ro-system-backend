import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { VendorService } from './vendor.service';
import { Vendor } from '@prisma/client';
import { vendorFilterableFields } from './vendor.constant';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await VendorService.insertIntoDB(data);

  sendResponse<Vendor>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Vendor Created Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, vendorFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await VendorService.getAll(filters, paginationOptions);

  sendResponse<Vendor[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Vendors retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await VendorService.getSingle(id);

  sendResponse<Vendor>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Vendor retrieved successfully',
    data: result,
  });
});

// update single
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await VendorService.updateSingle(id, data);

  sendResponse<Vendor>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Vendor Updated Successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await VendorService.deleteFromDB(id);

  sendResponse<Vendor>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Vendor Deleted successfully',
    data: result,
  });
});

export const VendorController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
