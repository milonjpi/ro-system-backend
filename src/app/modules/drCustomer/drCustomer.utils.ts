import prisma from '../../../shared/prisma';

// find Last ID
const findLastId = async (): Promise<string> => {
  const currentId = await prisma.drCustomer.findFirst({
    orderBy: {
      customerId: 'desc',
    },
    select: {
      customerId: true,
    },
  });

  const splitCurrent = currentId?.customerId?.split('D-') || ['', '0'];
  return splitCurrent[1];
};

// generate dr customer ID
export const generateDrCustomerId = async (): Promise<string> => {
  const currentId = parseInt(await findLastId());

  const incrementId = currentId + 1;
  return incrementId?.toString().padStart(8, 'D-000000');
};
