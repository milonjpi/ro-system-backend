import prisma from '../../../shared/prisma';

// find Last ID
const findLastId = async (date: string): Promise<string> => {
  const currentId = await prisma.distVoucher.findFirst({
    where: {
      voucherNo: {
        contains: date,
        mode: 'insensitive',
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      voucherNo: true,
    },
  });

  const splitCurrent = currentId?.voucherNo?.split('-') || ['', '0'];

  return splitCurrent[1];
};

// generate voucher no
export const generateDistVoucherNo = async (date: string): Promise<string> => {
  const currentId = parseInt(await findLastId(date));
  const incrementId = currentId + 1;

  return 'V' + date + '-' + incrementId;
};
