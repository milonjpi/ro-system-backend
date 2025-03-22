import { Recipient } from '@prisma/client';

export type IRecipientFilters = {
  searchTerm?: string;
};

export type IRecipientResponse = {
  data: Recipient[];
  sum: number;
};
