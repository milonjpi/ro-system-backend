import prisma from '../../../shared/prisma';

// find Last ID
const findLastId = async (): Promise<string> => {
  const currentId = await prisma.product.findFirst({
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      productId: true,
    },
  });

  const splitCurrent = currentId?.productId?.split('P-') || ['', '0'];

  return splitCurrent[1];
};

// generate product ID
export const generateProductId = async (): Promise<string> => {
  const currentId = parseInt(await findLastId());
  const incrementId = currentId + 1;

  return incrementId?.toString().padStart(8, 'P-000000');
};
