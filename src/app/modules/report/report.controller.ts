import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { ReportService } from './report.service';
import {
  IAdvanceReport,
  IBalanceSheet,
  IDailyReport,
  IDonationReport,
  IDueReport,
  IInvoiceSummary,
} from './report.interface';
import pick from '../../../shared/pick';
import {
  dailyReportFilterableFields,
  donationFilterableFields,
  dueReportFilterableFields,
} from './report.constant';

// get due report
const dueReport = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, dueReportFilterableFields);

  const result = await ReportService.dueReport(filters);

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

// get summary
const summary = catchAsync(async (req: Request, res: Response) => {
  const customerId = req.query.customerId as string;
  const result = await ReportService.summary(customerId);

  sendResponse<IInvoiceSummary[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Summary retrieved successfully',
    data: result,
  });
});

// get summary
const balanceSheet = catchAsync(async (req: Request, res: Response) => {
  const result = await ReportService.balanceSheet();

  sendResponse<IBalanceSheet>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Balance Sheet retrieved successfully',
    data: result,
  });
});

// get summary
const donationReport = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, donationFilterableFields);
  const result = await ReportService.donationReport(filters);

  sendResponse<IDonationReport[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Donation retrieved successfully',
    data: result,
  });
});

// daily report
const dailyReport = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, dailyReportFilterableFields);

  const result = await ReportService.dailyReport(filters);

  sendResponse<IDailyReport>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Daily Report retrieved successfully',
    data: result,
  });
});

export const ReportController = {
  dueReport,
  advanceReport,
  summary,
  balanceSheet,
  donationReport,
  dailyReport,
};
