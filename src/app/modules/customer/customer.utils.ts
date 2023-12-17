import prisma from '../../../shared/prisma';

// find Last ID
const findLastId = async (): Promise<string> => {
  const currentId = await prisma.customer.findFirst({
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      customerId: true,
    },
  });

  const splitCurrent = currentId?.customerId?.split('C-') || ['', '0'];

  return splitCurrent[1];
};

// generate customer ID
export const generateCustomerId = async (): Promise<string> => {
  const currentId = parseInt(await findLastId());
  const incrementId = currentId + 1;

  return incrementId?.toString().padStart(8, 'C-000000');
};
