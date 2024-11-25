import prisma from '../../../shared/prisma';

// find Last ID
const findLastId = async (date: string): Promise<string> => {
  const currentId = await prisma.invoice.findFirst({
    where: {
      invoiceNo: {
        contains: date,
        mode: 'insensitive',
      },
    },
    orderBy: {
      invoiceNo: 'desc',
    },
    select: {
      invoiceNo: true,
    },
  });

  const splitCurrent = currentId?.invoiceNo?.split('-') || ['', '0'];

  return splitCurrent[1];
};

// generate invoice no
export const generateInvoiceNo = async (date: string): Promise<string> => {
  const currentId = parseInt(await findLastId(date));
  const incrementId = currentId + 1;

  return 'I' + date + '-' + incrementId.toString().padStart(3, '000');
};
