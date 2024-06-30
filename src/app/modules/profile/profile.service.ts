import prisma from '../../../shared/prisma';
import { User } from '@prisma/client';

// get profile
const getProfile = async (id: string): Promise<User | null> => {
  const result = await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      menus: true,
      subMenus: true,
      sections: true,
      distributor: true,
    },
  });

  return result;
};

export const ProfileService = {
  getProfile,
};
