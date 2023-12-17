import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { MenuPermission } from '@prisma/client';
import ApiError from '../../../errors/ApiError';

// add menu
const addMenu = async (
  data: MenuPermission
): Promise<MenuPermission | null> => {
  const result = await prisma.menuPermission.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Add Menu');
  }

  return result;
};

// remove Menu
const removeMenu = async (id: string): Promise<MenuPermission | null> => {
  // check is exist
  const isExist = await prisma.menuPermission.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Menu Not Found');
  }

  const result = await prisma.menuPermission.delete({
    where: {
      id,
    },
  });

  return result;
};

export const MenuPermissionService = {
  addMenu,
  removeMenu,
};
