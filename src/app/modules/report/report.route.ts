import express from 'express';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { ReportController } from './report.controller';

const router = express.Router();

// get due report
router.get(
  '/due-report',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  ReportController.dueReport
);

// get advance report
router.get(
  '/advance-report',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  ReportController.advanceReport
);

// get advance report
router.get(
  '/summary',
  // auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  ReportController.summary
);

export const ReportRoutes = router;
