import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { ReportService } from './report.service';
import { IDueReport } from './report.interface';

// get due report
const dueReport = catchAsync(async (req: Request, res: Response) => {
  const result = await ReportService.dueReport();

  sendResponse<IDueReport[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Customers retrieved successfully',
    data: result,
  });
});

export const ReportController = {
  dueReport,
};
