import prisma from '../../../shared/prisma';

// find Last ID
const findLastId = async (): Promise<string> => {
  const currentId = await prisma.equipment.findFirst({
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      equipmentCode: true,
    },
  });

  const splitCurrent = currentId?.equipmentCode?.split('E-') || ['', '0'];

  return splitCurrent[1];
};

// generate equipment code
export const generateEquipmentCode = async (): Promise<string> => {
  const currentId = parseInt(await findLastId());
  const incrementId = currentId + 1;

  return incrementId?.toString().padStart(8, 'E-000000');
};
