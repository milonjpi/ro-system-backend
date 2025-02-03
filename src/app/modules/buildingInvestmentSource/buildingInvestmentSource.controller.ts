import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { BuildingInvestmentSourceService } from './buildingInvestmentSource.service';
import { BuildingInvestmentSource } from '@prisma/client';
import { buildingInvestmentSourceFilterableFields } from './buildingInvestmentSource.constant';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await BuildingInvestmentSourceService.insertIntoDB(data);

  sendResponse<BuildingInvestmentSource>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Investment Source Created Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, buildingInvestmentSourceFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await BuildingInvestmentSourceService.getAll(
    filters,
    paginationOptions
  );

  sendResponse<BuildingInvestmentSource[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Investment Sources retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await BuildingInvestmentSourceService.getSingle(id);

  sendResponse<BuildingInvestmentSource>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Investment Source retrieved successfully',
    data: result,
  });
});

// update single
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await BuildingInvestmentSourceService.updateSingle(id, data);

  sendResponse<BuildingInvestmentSource>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Investment Source Updated Successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await BuildingInvestmentSourceService.deleteFromDB(id);

  sendResponse<BuildingInvestmentSource>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Investment Source Deleted successfully',
    data: result,
  });
});

export const BuildingInvestmentSourceController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
