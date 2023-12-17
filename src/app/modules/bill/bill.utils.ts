import prisma from '../../../shared/prisma';

// find Last ID
const findLastId = async (): Promise<string> => {
  const currentId = await prisma.bill.findFirst({
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      billNo: true,
    },
  });

  const splitCurrent = currentId?.billNo?.split('B-') || ['', '0'];

  return splitCurrent[1];
};

// generate bill no
export const generateBillNo = async (): Promise<string> => {
  const currentId = parseInt(await findLastId());
  const incrementId = currentId + 1;

  return incrementId?.toString().padStart(8, 'B-000000');
};
