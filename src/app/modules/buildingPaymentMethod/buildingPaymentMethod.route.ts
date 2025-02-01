import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { BuildingPaymentMethodValidation } from './buildingPaymentMethod.validation';
import { BuildingPaymentMethodController } from './buildingPaymentMethod.controller';

const router = express.Router();

// create
router.post(
  '/create',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  validateRequest(BuildingPaymentMethodValidation.create),
  BuildingPaymentMethodController.insertIntoDB
);

// get all
router.get(
  '/',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  BuildingPaymentMethodController.getAll
);

// get single
router.get(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  BuildingPaymentMethodController.getSingle
);

// update single
router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  validateRequest(BuildingPaymentMethodValidation.update),
  BuildingPaymentMethodController.updateSingle
);

// delete
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  BuildingPaymentMethodController.deleteFromDB
);

export const BuildingPaymentMethodRoutes = router;
