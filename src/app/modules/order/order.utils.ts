import prisma from '../../../shared/prisma';

// find Last ID
const findLastId = async (): Promise<string> => {
  const currentId = await prisma.order.findFirst({
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      orderNo: true,
    },
  });

  const splitCurrent = currentId?.orderNo?.split('O-') || ['', '0'];

  return splitCurrent[1];
};

// generate order no
export const generateOrderNo = async (): Promise<string> => {
  const currentId = parseInt(await findLastId());
  const incrementId = currentId + 1;

  return incrementId?.toString().padStart(8, 'O-000000');
};
