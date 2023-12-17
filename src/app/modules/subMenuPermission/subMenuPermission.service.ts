import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { SubMenuPermission } from '@prisma/client';
import ApiError from '../../../errors/ApiError';

// add sub menu
const addSubMenu = async (
  data: SubMenuPermission
): Promise<SubMenuPermission | null> => {
  const result = await prisma.subMenuPermission.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Add Sub Menu');
  }

  return result;
};

// remove Menu
const removeSubMenu = async (id: string): Promise<SubMenuPermission | null> => {
  // check is exist
  const isExist = await prisma.subMenuPermission.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Sub Menu Not Found');
  }

  const result = await prisma.subMenuPermission.delete({
    where: {
      id,
    },
  });

  return result;
};

export const SubMenuPermissionService = {
  addSubMenu,
  removeSubMenu,
};
