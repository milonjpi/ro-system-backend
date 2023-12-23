import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { dueReportFilterableFields } from './report.constant';
import { paginationFields } from '../../../constants/pagination';
import { ReportService } from './report.service';
import { Customer } from '@prisma/client';

// get due report
const dueReport = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, dueReportFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await ReportService.dueReport(filters, paginationOptions);

  sendResponse<Customer[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Customers retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

export const ReportController = {
  dueReport,
};
