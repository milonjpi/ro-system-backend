import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { BuildingInvestmentService } from './buildingInvestment.service';
import { BuildingInvestment } from '@prisma/client';
import { buildingInvestmentFilterableFields } from './buildingInvestment.constant';
import { IBuildingInvestmentResponse } from './buildingInvestment.interface';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await BuildingInvestmentService.insertIntoDB(data);

  sendResponse<BuildingInvestment>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Investment Created Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, buildingInvestmentFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await BuildingInvestmentService.getAll(
    filters,
    paginationOptions
  );

  sendResponse<IBuildingInvestmentResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Investments retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await BuildingInvestmentService.getSingle(id);

  sendResponse<BuildingInvestment>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Investment retrieved successfully',
    data: result,
  });
});

// update single
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await BuildingInvestmentService.updateSingle(id, data);

  sendResponse<BuildingInvestment>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Investment Updated Successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await BuildingInvestmentService.deleteFromDB(id);

  sendResponse<BuildingInvestment>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Investment Deleted successfully',
    data: result,
  });
});

export const BuildingInvestmentController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
