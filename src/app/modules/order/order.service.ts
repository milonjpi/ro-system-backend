import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { Order, OrderedProduct, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { IOrderFilters } from './order.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { orderSearchableFields } from './order.constant';
import { generateOrderNo } from './order.utils';

// create
const insertIntoDB = async (
  data: Order,
  orderedProducts: OrderedProduct[]
): Promise<Order | null> => {
  // generate order no
  const orderNo = await generateOrderNo();

  // set order no
  data.orderNo = orderNo;
  const result = await prisma.order.create({
    data: { ...data, orderedProducts: { create: orderedProducts } },
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Create');
  }

  return result;
};

// get all
const getAll = async (
  filters: IOrderFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Order[]>> => {
  const { searchTerm, startDate, endDate, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (startDate) {
    andConditions.push({
      date: {
        gte: new Date(`${startDate}, 00:00:00`),
      },
    });
  }
  if (endDate) {
    andConditions.push({
      date: {
        lte: new Date(`${endDate}, 23:59:59`),
      },
    });
  }

  if (searchTerm) {
    andConditions.push({
      OR: orderSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.entries(filterData).map(([field, value]) => ({
        [field]: value === 'true' ? true : value === 'false' ? false : value,
      })),
    });
  }

  const whereConditions: Prisma.OrderWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.order.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
    include: {
      customer: true,
      orderedProducts: {
        include: {
          product: true,
        },
      },
    },
  });

  const total = await prisma.order.count({
    where: whereConditions,
  });
  const totalPage = Math.ceil(total / limit);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage,
    },
    data: result,
  };
};

// get single
const getSingle = async (id: string): Promise<Order | null> => {
  const result = await prisma.order.findUnique({
    where: {
      id,
    },
  });

  return result;
};

// update
const updateSingle = async (
  id: string,
  payload: Partial<Order>,
  orderedProducts: OrderedProduct[]
): Promise<Order | null> => {
  // check is exist
  const isExist = await prisma.order.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  if (isExist.status === 'Delivered') {
    throw new ApiError(httpStatus.NOT_FOUND, 'You cant Update after delivered');
  }
  if (isExist.status === 'Canceled') {
    throw new ApiError(httpStatus.NOT_FOUND, 'You cant Update after canceled');
  }

  const result = await prisma.$transaction(async trans => {
    await trans.order.update({
      where: {
        id,
      },
      data: {
        orderedProducts: {
          deleteMany: {},
        },
      },
    });

    return await trans.order.update({
      where: {
        id,
      },
      data: {
        ...payload,
        orderedProducts: {
          create: orderedProducts,
        },
      },
    });
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Update');
  }

  return result;
};

// delete
const deleteFromDB = async (id: string): Promise<Order | null> => {
  // check is exist
  const isExist = await prisma.order.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  if (isExist.status === 'Delivered') {
    throw new ApiError(httpStatus.NOT_FOUND, 'You cant delete after delivered');
  }

  const result = await prisma.$transaction(async trans => {
    await trans.order.update({
      where: {
        id,
      },
      data: {
        orderedProducts: {
          deleteMany: {},
        },
      },
    });

    return await trans.order.delete({
      where: {
        id,
      },
    });
  });

  return result;
};

const cancelOrder = async (id: string): Promise<Order | null> => {
  // check is exist
  const isExist = await prisma.order.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  if (isExist.status === 'Delivered') {
    throw new ApiError(httpStatus.NOT_FOUND, 'You cant Cancel after delivered');
  }

  if (isExist.status === 'Canceled') {
    throw new ApiError(httpStatus.NOT_FOUND, 'Already Canceled');
  }
  const result = await prisma.order.update({
    where: { id },
    data: { status: 'Canceled' },
  });
  return result;
};

export const OrderService = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
  cancelOrder,
};
