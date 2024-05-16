export const getMonthDifferenceFromDate = (startDate: Date, endDate: Date = new Date()): number => {
  return endDate.getMonth() - startDate.getMonth() + 12 * (endDate.getFullYear() - startDate.getFullYear());
};

export default getMonthDifferenceFromDate;
