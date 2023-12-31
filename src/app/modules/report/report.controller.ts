import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { ReportService } from './report.service';
import { IAdvanceReport, IDueReport } from './report.interface';

// get due report
const dueReport = catchAsync(async (req: Request, res: Response) => {
  const result = await ReportService.dueReport();

  sendResponse<IDueReport[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Customers due retrieved successfully',
    data: result,
  });
});

// get advance report
const advanceReport = catchAsync(async (req: Request, res: Response) => {
  const result = await ReportService.advanceReport();

  sendResponse<IAdvanceReport[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Customers Advance retrieved successfully',
    data: result,
  });
});

export const ReportController = {
  dueReport,
  advanceReport,
};
