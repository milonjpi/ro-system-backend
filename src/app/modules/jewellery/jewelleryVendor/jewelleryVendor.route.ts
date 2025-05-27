import express from 'express';
import { JewelleryVendorValidation } from './jewelleryVendor.validation';
import { JewelleryVendorController } from './jewelleryVendor.controller';
import auth from '../../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../../enums/user';
import validateRequest from '../../../middlewares/validateRequest';

const router = express.Router();

// create
router.post(
  '/create',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  validateRequest(JewelleryVendorValidation.create),
  JewelleryVendorController.insertIntoDB
);

// get all
router.get(
  '/',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  JewelleryVendorController.getAll
);

// get single
router.get(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  JewelleryVendorController.getSingle
);

// update single
router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  validateRequest(JewelleryVendorValidation.update),
  JewelleryVendorController.updateSingle
);

// delete
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  JewelleryVendorController.deleteFromDB
);

export const JewelleryVendorRoutes = router;
