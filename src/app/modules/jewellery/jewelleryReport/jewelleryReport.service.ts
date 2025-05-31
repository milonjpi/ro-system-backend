import prisma from '../../../../shared/prisma';
import groupBy from 'lodash.groupby';
import {
  ICaratWiseSummary,
  IJewellerySummary,
  IJewelleryZakat,
  ITypeWiseSummary,
} from './jewelleryReport.interface';
import { totalSum } from '../../../../shared/utils';

// get summary
const getSummary = async (): Promise<IJewellerySummary[]> => {
  const result = await prisma.jewellery.groupBy({
    where: { isSold: false, isExchanged: false },
    by: ['category'],
    _sum: {
      weight: true,
      price: true,
    },
    orderBy: {
      category: 'asc',
    },
  });

  const mappedResult = result?.map(el => ({
    category: el.category,
    weight: el._sum?.weight || 0,
    price: el._sum?.price || 0,
  }));

  return mappedResult;
};

// get carat wise summary
const getCaratWiseSummary = async (): Promise<ICaratWiseSummary[]> => {
  const result = await prisma.jewellery.groupBy({
    where: { isSold: false, isExchanged: false },
    by: ['category', 'caratId'],
    _sum: {
      weight: true,
      price: true,
    },
    orderBy: {
      category: 'asc',
    },
  });

  const allCarats = await prisma.carat.findMany();

  const groupedResult = groupBy(result, el => el.category);

  const mappedResult = Object.entries(groupedResult).map(el => ({
    category: el[0],
    carats: el[1]?.map(bl => {
      const findCarat = allCarats?.find(cl => cl.id === bl.caratId);
      return {
        carat: findCarat?.label,
        weight: bl._sum?.weight || 0,
        price: bl._sum?.price || 0,
      };
    }),
  }));

  return mappedResult;
};

// get type wise summary
const getTypeWiseSummary = async (): Promise<ITypeWiseSummary[]> => {
  const result = await prisma.jewellery.groupBy({
    where: { isSold: false, isExchanged: false },
    by: ['category', 'jewelleryTypeId', 'caratId'],
    _sum: {
      weight: true,
    },
    orderBy: {
      category: 'asc',
    },
  });
  const preMappedResult = result?.map(el => ({
    ...el,
    weight: el._sum?.weight || 0,
  }));

  const allTypes = await prisma.jewelleryType.findMany();
  const allCarats = await prisma.carat.findMany();

  const groupedResult = groupBy(preMappedResult, el => el.category);

  const mappedResult = Object.entries(groupedResult)
    .map(el => {
      const groupType = groupBy(el[1], bl => bl.jewelleryTypeId);

      return {
        category: el[0],
        weight: totalSum(el[1], 'weight'),
        types: Object.entries(groupType)
          .map(bl => {
            const findType = allTypes?.find(cl => cl.id === bl[0]);

            return {
              type: findType?.label || '',
              weight: totalSum(bl[1], 'weight'),
              carats: bl[1]
                ?.map(cl => {
                  const findCarat = allCarats?.find(dl => dl.id === cl.caratId);
                  return {
                    carat: findCarat?.label || '',
                    weight: cl._sum?.weight || 0,
                  };
                })
                .sort((a, b) => b.carat.localeCompare(a.carat)), // carats sorted by carat label
            };
          })
          .sort((a, b) => a.type.localeCompare(b.type)), // types sorted by type label
      };
    })
    .sort((a, b) => a.category.localeCompare(b.category));

  return mappedResult;
};

// get zakat
const getZakat = async (filters: {
  date?: string;
}): Promise<IJewelleryZakat[]> => {
  const { date } = filters;

  const result = await prisma.jewellery.groupBy({
    where: { isSold: false, isExchanged: false },
    by: ['category', 'caratId'],
    _sum: {
      weight: true,
    },
  });

  const allCarats = await prisma.carat.findMany();

  const allRates = await prisma.jewelleryRate.findMany({
    where: date ? { date } : {},
    include: {
      carat: true,
    },
  });

  const groupedResult = groupBy(result, el => el.category);

  const mappedResult = Object.entries(groupedResult)
    .map(el => ({
      category: el[0],
      carats: el[1]
        ?.map(bl => {
          const findCarat = allCarats?.find(cl => cl.id === bl.caratId);
          const findRate = allRates?.find(cl => cl.caratId === bl.caratId);
          return {
            carat: findCarat?.label,
            unitPrice: findRate?.price || 0,
            weight: bl._sum?.weight || 0,
            price: (findRate?.price || 0) * (bl._sum?.weight || 0),
          };
        })
        .sort((a, b) => {
          const itemA = a.carat || '';
          const itemB = b.carat || '';
          return itemB.localeCompare(itemA);
        }),
    }))
    .sort((a, b) => a.category.localeCompare(b.category));

  return mappedResult;
};

export const JewelleryReportService = {
  getSummary,
  getCaratWiseSummary,
  getTypeWiseSummary,
  getZakat,
};
