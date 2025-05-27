import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { JewelleryVendorService } from './jewelleryVendor.service';
import { JewelleryVendor } from '@prisma/client';
import { jewelleryVendorFilterableFields } from './jewelleryVendor.constant';
import catchAsync from '../../../../shared/catchAsync';
import sendResponse from '../../../../shared/sendResponse';
import pick from '../../../../shared/pick';
import { paginationFields } from '../../../../constants/pagination';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await JewelleryVendorService.insertIntoDB(data);

  sendResponse<JewelleryVendor>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Vendor Created Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, jewelleryVendorFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await JewelleryVendorService.getAll(
    filters,
    paginationOptions
  );

  sendResponse<JewelleryVendor[]>(res, {
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

  const result = await JewelleryVendorService.getSingle(id);

  sendResponse<JewelleryVendor>(res, {
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

  const result = await JewelleryVendorService.updateSingle(id, data);

  sendResponse<JewelleryVendor>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Vendor Updated Successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await JewelleryVendorService.deleteFromDB(id);

  sendResponse<JewelleryVendor>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Vendor Deleted successfully',
    data: result,
  });
});

export const JewelleryVendorController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
