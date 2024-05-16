export const addMonthsToDate = (date: Date, months: number): Date => {
  const dateWithAddedMonths = new Date(date);
  const d = dateWithAddedMonths.getDate();
  dateWithAddedMonths.setMonth(dateWithAddedMonths.getMonth() + months);
  if (dateWithAddedMonths.getDate() !== d) {
    dateWithAddedMonths.setDate(0);
  }
  return dateWithAddedMonths;
};

export default addMonthsToDate;
