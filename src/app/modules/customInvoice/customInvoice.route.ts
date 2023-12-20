import express from 'express';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { CustomInvoiceController } from './customInvoice.controller';

const router = express.Router();

// get custom invoices
router.get(
  '/',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  CustomInvoiceController.getCustomInvoices
);

export const CustomInvoiceRoutes = router;
