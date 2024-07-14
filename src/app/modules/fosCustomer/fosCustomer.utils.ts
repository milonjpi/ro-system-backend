import prisma from '../../../shared/prisma';

// find Last ID
const findLastId = async (): Promise<string> => {
  const currentId = await prisma.fosCustomer.findFirst({
    orderBy: {
      customerId: 'desc',
    },
    select: {
      customerId: true,
    },
  });

  const splitCurrent = currentId?.customerId?.split('FC-') || ['', '0'];
  return splitCurrent[1];
};

// generate fos customer ID
export const generateFosCustomerId = async (): Promise<string> => {
  const currentId = parseInt(await findLastId());

  const incrementId = currentId + 1;
  return incrementId?.toString().padStart(8, 'FC-000000');
};
