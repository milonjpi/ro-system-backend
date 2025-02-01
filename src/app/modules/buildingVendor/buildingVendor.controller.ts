import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { BuildingVendorService } from './buildingVendor.service';
import { BuildingVendor } from '@prisma/client';
import { buildingVendorFilterableFields } from './buildingVendor.constant';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await BuildingVendorService.insertIntoDB(data);

  sendResponse<BuildingVendor>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Vendor Created Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, buildingVendorFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await BuildingVendorService.getAll(filters, paginationOptions);

  sendResponse<BuildingVendor[]>(res, {
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

  const result = await BuildingVendorService.getSingle(id);

  sendResponse<BuildingVendor>(res, {
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

  const result = await BuildingVendorService.updateSingle(id, data);

  sendResponse<BuildingVendor>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Vendor Updated Successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await BuildingVendorService.deleteFromDB(id);

  sendResponse<BuildingVendor>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Vendor Deleted successfully',
    data: result,
  });
});

export const BuildingVendorController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
