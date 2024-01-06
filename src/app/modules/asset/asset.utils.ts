import prisma from '../../../shared/prisma';

// find Last ID
const findLastId = async (): Promise<string> => {
  const currentId = await prisma.asset.findFirst({
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      assetCode: true,
    },
  });

  const splitCurrent = currentId?.assetCode?.split('AST-') || ['', '0'];

  return splitCurrent[1];
};

// generate asset code
export const generateAssetCode = async (): Promise<string> => {
  const currentId = parseInt(await findLastId());
  const incrementId = currentId + 1;

  return incrementId?.toString().padStart(8, 'AST-000000');
};
