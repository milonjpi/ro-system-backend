import prisma from '../../../shared/prisma';

// find Last ID
const findLastId = async (): Promise<string> => {
  const currentId = await prisma.fosProduct.findFirst({
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      productId: true,
    },
  });

  const splitCurrent = currentId?.productId?.split('FP-') || ['', '0'];

  return splitCurrent[1];
};

// generate fos product ID
export const generateFosProductId = async (): Promise<string> => {
  const currentId = parseInt(await findLastId());
  const incrementId = currentId + 1;

  return incrementId?.toString().padStart(8, 'FP-000000');
};
