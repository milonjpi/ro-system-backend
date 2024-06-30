import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { DistVendorValidation } from './distVendor.validation';
import { DistVendorController } from './distVendor.controller';

const router = express.Router();

// create
router.post(
  '/create',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  validateRequest(DistVendorValidation.create),
  DistVendorController.insertIntoDB
);

// get all
router.get(
  '/',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  DistVendorController.getAll
);

// get single
router.get(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  DistVendorController.getSingle
);

// update single
router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  validateRequest(DistVendorValidation.update),
  DistVendorController.updateSingle
);

// delete
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  DistVendorController.deleteFromDB
);

export const DistVendorRoutes = router;
