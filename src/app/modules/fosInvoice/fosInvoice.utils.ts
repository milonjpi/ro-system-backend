import prisma from '../../../shared/prisma';

// find Last ID
const findLastId = async (date: string): Promise<string> => {
  const currentId = await prisma.fosInvoice.findFirst({
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

// generate fos invoice no
export const generateFosInvoiceNo = async (date: string): Promise<string> => {
  const currentId = parseInt(await findLastId(date));
  const incrementId = currentId + 1;

  return 'FI' + date + '-' + incrementId;
};
