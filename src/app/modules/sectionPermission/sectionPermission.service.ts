import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { SectionPermission } from '@prisma/client';
import ApiError from '../../../errors/ApiError';

// add section
const addSection = async (
  data: SectionPermission
): Promise<SectionPermission | null> => {
  const result = await prisma.sectionPermission.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Add Section');
  }

  return result;
};

// remove section
const removeSection = async (id: string): Promise<SectionPermission | null> => {
  // check is exist
  const isExist = await prisma.sectionPermission.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Section Not Found');
  }

  const result = await prisma.sectionPermission.delete({
    where: {
      id,
    },
  });

  return result;
};

export const SectionPermissionService = {
  addSection,
  removeSection,
};
