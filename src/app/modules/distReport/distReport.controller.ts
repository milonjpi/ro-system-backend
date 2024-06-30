import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { distDueReportFilterableFields } from './distReport.constant';
import { DistReportService } from './distReport.service';
import {
  IDistAdvanceReport,
  IDistDashboardResponse,
  IDistDueReport,
  IDistInvoiceSummary,
} from './distReport.interface';

// get due report
const dueReport = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, distDueReportFilterableFields);

  const result = await DistReportService.dueReport(filters);

  sendResponse<IDistDueReport[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Customers due retrieved successfully',
    data: result,
  });
});

// get advance report
const advanceReport = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, distDueReportFilterableFields);
  const result = await DistReportService.advanceReport(filters);

  sendResponse<IDistAdvanceReport[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Customers Advance retrieved successfully',
    data: result,
  });
});

// get summary
const summary = catchAsync(async (req: Request, res: Response) => {
  const customerId = req.query.customerId as string;
  const result = await DistReportService.summary(customerId);

  sendResponse<IDistInvoiceSummary[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Summary retrieved successfully',
    data: result,
  });
});

// get vendor advanced due
const vendorDueAdvanced = catchAsync(async (req: Request, res: Response) => {
  const result = await DistReportService.vendorDueAdvanced();

  sendResponse<IDistAdvanceReport[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Vendor Due Advanced retrieved successfully',
    data: result,
  });
});

// get dashboard data
const dashboardData = catchAsync(async (req: Request, res: Response) => {
  const distributorId = (req.query.distributorId || '123') as string;
  const result = await DistReportService.dashboardData(distributorId);

  sendResponse<IDistDashboardResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Dashboard retrieved successfully',
    data: result,
  });
});

export const DistReportController = {
  dueReport,
  advanceReport,
  summary,
  vendorDueAdvanced,
  dashboardData,
};
