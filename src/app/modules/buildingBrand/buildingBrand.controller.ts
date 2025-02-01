import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { BuildingBrandService } from './buildingBrand.service';
import { BuildingBrand } from '@prisma/client';
import { buildingBrandFilterableFields } from './buildingBrand.constant';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await BuildingBrandService.insertIntoDB(data);

  sendResponse<BuildingBrand>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Brand Created Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, buildingBrandFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await BuildingBrandService.getAll(filters, paginationOptions);

  sendResponse<BuildingBrand[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Brands retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await BuildingBrandService.getSingle(id);

  sendResponse<BuildingBrand>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Brand retrieved successfully',
    data: result,
  });
});

// update single
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await BuildingBrandService.updateSingle(id, data);

  sendResponse<BuildingBrand>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Brand Updated Successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await BuildingBrandService.deleteFromDB(id);

  sendResponse<BuildingBrand>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Brand Deleted successfully',
    data: result,
  });
});

export const BuildingBrandController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
