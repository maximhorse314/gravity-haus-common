/**
 * @param startDate date to remove months from
 * @param months number of months to remove from the date
 * @returns Date
 */
export const subtractMonthFromDate = (startDate: Date, numOfMonths: number = 1): Date => {
  const date = new Date(startDate || new Date());

  const day = date.getDate();
  date.setMonth(date.getMonth() - numOfMonths);
  if (date.getDate() !== day) date.setDate(0);
  return date;
};

export default subtractMonthFromDate;
