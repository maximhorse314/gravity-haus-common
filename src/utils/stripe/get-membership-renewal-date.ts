import addMonthsToDate from '../../date/add-months-to-date/add-months-to-date';
import getPlanTerm from './get-plan-term';

export const getMembershipRenewalDate = (currentSub: any): Date => {
  const currentDate = new Date();
  const created = new Date(currentSub.created * 1000);
  let date;
  if (created.getDate() < 5) {
    // first day of current month
    date = new Date(created.getFullYear(), created.getMonth(), 1, 0, 0, 0, 0);
  } else {
    // first day of the next month
    date = new Date(created.getFullYear(), created.getMonth() + 1, 1, 0, 0, 0, 0);
  }

  const term = getPlanTerm(currentSub);
  date = addMonthsToDate(date, term);

  if (date < currentDate) {
    if (term === 1) {
      date = addMonthsToDate(date, 1);
    } else {
      date = addMonthsToDate(date, 12);
    }
  }

  return date;
};

export default getMembershipRenewalDate;
