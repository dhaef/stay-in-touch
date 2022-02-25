export const removeDbItems = (item) => {
  if (!item) return;
  const { pk, sk, gsiOnePk, gsiOneSk, ...rest } = item;
  return rest;
};
