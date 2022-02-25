export const getFrequencyType = (frequencyType: any) => {
  const type = frequencyType.toLowerCase();
  if (type === 'd' || type === 'day' || type === 'days') return 'day';
  if (type === 'w' || type === 'week' || type === 'weeks') return 'week';
  if (type === 'm' || type === 'month' || type === 'months') return 'month';
  if (type === 'y' || type === 'year' || type === 'years') return 'year';
};
