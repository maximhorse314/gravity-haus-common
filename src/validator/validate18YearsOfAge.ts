// eslint-disable-next-line max-len
import getMonthDifferenceFromDate from '../date/get-month-difference-from-date/get-month-difference-from-date';

export const validate18YearsOfAge = (dateOfBirth: string): string | undefined => {
  const dob = new Date(dateOfBirth);
  const today = new Date();
  const months = getMonthDifferenceFromDate(dob, today);
  const years = months / 12;
  if (years < 18) {
    return 'You must be 18 years of age or older to sign up';
  }
};

export default validate18YearsOfAge;
