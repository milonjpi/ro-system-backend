import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { DistVendorService } from './distVendor.service';
import { DistVendor } from '@prisma/client';
import { distVendorFilterableFields } from './distVendor.constant';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await DistVendorService.insertIntoDB(data);

  sendResponse<DistVendor>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Vendor Created Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, distVendorFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await DistVendorService.getAll(filters, paginationOptions);

  sendResponse<DistVendor[]>(res, {
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

  const result = await DistVendorService.getSingle(id);

  sendResponse<DistVendor>(res, {
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

  const result = await DistVendorService.updateSingle(id, data);

  sendResponse<DistVendor>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Vendor Updated Successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await DistVendorService.deleteFromDB(id);

  sendResponse<DistVendor>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Vendor Deleted successfully',
    data: result,
  });
});

export const DistVendorController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
