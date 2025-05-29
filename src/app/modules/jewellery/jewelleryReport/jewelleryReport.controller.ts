import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../../shared/catchAsync';
import sendResponse from '../../../../shared/sendResponse';
import pick from '../../../../shared/pick';
import { JewelleryReportService } from './jewelleryReport.service';
import {
  ICaratWiseSummary,
  IJewellerySummary,
  IJewelleryZakat,
  ITypeWiseSummary,
} from './jewelleryReport.interface';

// get summary
const getSummary = catchAsync(async (req: Request, res: Response) => {
  const result = await JewelleryReportService.getSummary();

  sendResponse<IJewellerySummary[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Summary retrieved successfully',
    data: result,
  });
});

// get carat wise summary
const getCaratWiseSummary = catchAsync(async (req: Request, res: Response) => {
  const result = await JewelleryReportService.getCaratWiseSummary();

  sendResponse<ICaratWiseSummary[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Summary retrieved successfully',
    data: result,
  });
});

// get type wise summary
const getTypeWiseSummary = catchAsync(async (req: Request, res: Response) => {
  const result = await JewelleryReportService.getTypeWiseSummary();

  sendResponse<ITypeWiseSummary[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Summary retrieved successfully',
    data: result,
  });
});

// get zakat
const getZakat = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ['date']);
  const result = await JewelleryReportService.getZakat(filters);

  sendResponse<IJewelleryZakat[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Zakats retrieved successfully',
    data: result,
  });
});

export const JewelleryReportController = {
  getSummary,
  getCaratWiseSummary,
  getTypeWiseSummary,
  getZakat,
};
