import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { BuildingUomService } from './buildingUom.service';
import { BuildingUom } from '@prisma/client';
import { buildingUomFilterableFields } from './buildingUom.constant';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await BuildingUomService.insertIntoDB(data);

  sendResponse<BuildingUom>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Uom Created Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, buildingUomFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await BuildingUomService.getAll(filters, paginationOptions);

  sendResponse<BuildingUom[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Uom retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await BuildingUomService.getSingle(id);

  sendResponse<BuildingUom>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Uom retrieved successfully',
    data: result,
  });
});

// update single
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await BuildingUomService.updateSingle(id, data);

  sendResponse<BuildingUom>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Uom Updated Successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await BuildingUomService.deleteFromDB(id);

  sendResponse<BuildingUom>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Uom Deleted successfully',
    data: result,
  });
});

export const BuildingUomController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
