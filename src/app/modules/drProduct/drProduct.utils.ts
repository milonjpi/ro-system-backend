import prisma from '../../../shared/prisma';

// find Last ID
const findLastId = async (): Promise<string> => {
  const currentId = await prisma.drProduct.findFirst({
    orderBy: {
      productId: 'desc',
    },
    select: {
      productId: true,
    },
  });

  const splitCurrent = currentId?.productId?.split('DP-') || ['', '0'];

  return splitCurrent[1];
};

// generate dr product ID
export const generateDrProductId = async (): Promise<string> => {
  const currentId = parseInt(await findLastId());
  const incrementId = currentId + 1;

  return incrementId?.toString().padStart(8, 'DP-000000');
};
