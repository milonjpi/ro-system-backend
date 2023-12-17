import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { UserRoutes } from '../modules/user/user.route';
import { MenuPermissionRoutes } from '../modules/menuPermission/menuPermission.route';
import { SubMenuPermissionRoutes } from '../modules/subMenuPermission/subMenuPermission.route';
import { SectionPermissionRoutes } from '../modules/sectionPermission/sectionPermission.route';
import { ProfileRoutes } from '../modules/profile/profile.route';
import { AccountTypeRoutes } from '../modules/accountType/accountType.route';
import { AccountHeadRoutes } from '../modules/accountHead/accountHead.route';
import { PaymentMethodRoutes } from '../modules/paymentMethod/paymentMethod.route';
import { CustomerRoutes } from '../modules/customer/customer.route';
import { VendorRoutes } from '../modules/vendor/vendor.route';
import { ProductRoutes } from '../modules/product/product.route';
import { OrderRoutes } from '../modules/order/order.route';
import { InvoiceRoutes } from '../modules/invoice/invoice.route';
import { BillRoutes } from '../modules/bill/bill.route';
import { UomRoutes } from '../modules/uom/uom.route';
import { EquipmentRoutes } from '../modules/equipment/equipment.route';
import { EquipmentInRoutes } from '../modules/equipmentIn/equipmentIn.route';
import { EquipmentOutRoutes } from '../modules/equipmentOut/equipmentOut.route';
import { ExpenseHeadRoutes } from '../modules/expenseHead/expenseHead.route';
import { ExpenseRoutes } from '../modules/expense/expense.route';
import { CustomerGroupRoutes } from '../modules/customerGroup/customerGroup.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/profile',
    route: ProfileRoutes,
  },
  {
    path: '/menu-permission',
    route: MenuPermissionRoutes,
  },
  {
    path: '/subMenu-permission',
    route: SubMenuPermissionRoutes,
  },
  {
    path: '/section-permission',
    route: SectionPermissionRoutes,
  },
  {
    path: '/account-type',
    route: AccountTypeRoutes,
  },
  {
    path: '/account-head',
    route: AccountHeadRoutes,
  },
  {
    path: '/payment-method',
    route: PaymentMethodRoutes,
  },
  {
    path: '/customer-group',
    route: CustomerGroupRoutes,
  },
  {
    path: '/customer',
    route: CustomerRoutes,
  },
  {
    path: '/vendor',
    route: VendorRoutes,
  },
  {
    path: '/product',
    route: ProductRoutes,
  },
  {
    path: '/order',
    route: OrderRoutes,
  },
  {
    path: '/invoice',
    route: InvoiceRoutes,
  },
  {
    path: '/bill',
    route: BillRoutes,
  },
  {
    path: '/uom',
    route: UomRoutes,
  },
  {
    path: '/equipment',
    route: EquipmentRoutes,
  },
  {
    path: '/equipment-in',
    route: EquipmentInRoutes,
  },
  {
    path: '/equipment-out',
    route: EquipmentOutRoutes,
  },
  {
    path: '/expense-head',
    route: ExpenseHeadRoutes,
  },
  {
    path: '/expense',
    route: ExpenseRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
