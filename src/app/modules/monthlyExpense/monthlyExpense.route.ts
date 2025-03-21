import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { MonthlyExpenseValidation } from './monthlyExpense.validation';
import { MonthlyExpenseController } from './monthlyExpense.controller';

const router = express.Router();

// create
router.post(
  '/create',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  validateRequest(MonthlyExpenseValidation.create),
  MonthlyExpenseController.insertIntoDB
);

// get all
router.get(
  '/',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  MonthlyExpenseController.getAll
);

// get area wise report
router.get(
  '/area',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  MonthlyExpenseController.areaWiseReport
);

// get area wise dash report
router.get(
  '/area-dash',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  MonthlyExpenseController.areaWiseDashReport
);

// get head wise report
router.get(
  '/head',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  MonthlyExpenseController.headWiseReport
);

// get head wise dash report
router.get(
  '/head-dash',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  MonthlyExpenseController.headWiseDashReport
);

// get source wise report
router.get(
  '/source',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  MonthlyExpenseController.sourceWiseReport
);

// get single
router.get(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  MonthlyExpenseController.getSingle
);

// update single
router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  validateRequest(MonthlyExpenseValidation.update),
  MonthlyExpenseController.updateSingle
);

// delete
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  MonthlyExpenseController.deleteFromDB
);

export const MonthlyExpenseRoutes = router;
