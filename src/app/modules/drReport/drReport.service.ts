import prisma from '../../../shared/prisma';
import { IDrSummaryReport } from './drReport.interface';

// summary
const summary = async (): Promise<IDrSummaryReport[]> => {
  const invoices = await prisma.drInvoice.groupBy({
    by: ['customerId'],
    _sum: {
      totalQty: true,
      totalPrice: true,
      discount: true,
      amount: true,
      paidAmount: true,
    },
  });

  const customers = await prisma.drCustomer.findMany({
    where: { isActive: true },
  });

  const result = customers?.map(el => {
    const findInvoice = invoices?.find(inv => inv.customerId === el.id);

    return {
      ...el,
      totalQty: findInvoice?._sum?.totalQty || 0,
      totalPrice: findInvoice?._sum?.totalPrice || 0,
      discount: findInvoice?._sum?.discount || 0,
      amount: findInvoice?._sum?.amount || 0,
      paidAmount: findInvoice?._sum?.paidAmount || 0,
    };
  });

  return result;
};

export const DrSummaryService = {
  summary,
};
