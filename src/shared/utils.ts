/* eslint-disable @typescript-eslint/no-explicit-any */
export const asyncForEach = async (array: any[], callback: any) => {
  if (!Array.isArray(array)) {
    throw new Error('Expected an array');
  }
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

// summation of array
export const totalSum = (array: any[], key: string): number => {
  const initialValue = 0;
  return array.reduce(
    (total, item) => total + parseFloat(item[key] ? item[key] : 0),
    initialValue
  );
};
