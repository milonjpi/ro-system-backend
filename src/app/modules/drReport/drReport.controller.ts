import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { DrSummaryService } from './drReport.service';
import { IDrSummaryReport } from './drReport.interface';

//  summary
const summary = catchAsync(async (req: Request, res: Response) => {
  const result = await DrSummaryService.summary();

  sendResponse<IDrSummaryReport[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Summary retrieved successfully',
    data: result,
  });
});

export const DrSummaryController = {
  summary,
};
