import prisma from '../../../shared/prisma';

// find Last ID
const findLastId = async (): Promise<string> => {
  const currentId = await prisma.vendor.findFirst({
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      vendorId: true,
    },
  });

  const splitCurrent = currentId?.vendorId?.split('V-') || ['', '0'];

  return splitCurrent[1];
};

// generate vendor ID
export const generateVendorId = async (): Promise<string> => {
  const currentId = parseInt(await findLastId());
  const incrementId = currentId + 1;

  return incrementId?.toString().padStart(8, 'V-000000');
};
