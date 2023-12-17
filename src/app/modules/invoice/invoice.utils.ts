import prisma from '../../../shared/prisma';

// find Last ID
const findLastId = async (): Promise<string> => {
  const currentId = await prisma.invoice.findFirst({
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      invoiceNo: true,
    },
  });

  const splitCurrent = currentId?.invoiceNo?.split('I-') || ['', '0'];

  return splitCurrent[1];
};

// generate invoice no
export const generateInvoiceNo = async (): Promise<string> => {
  const currentId = parseInt(await findLastId());
  const incrementId = currentId + 1;

  return incrementId?.toString().padStart(8, 'I-000000');
};
