import planOrPriceId from './planOrPriceId';

const getPlanTerm = (currentSub) => {
  const planId = planOrPriceId(currentSub);
  const parts = planId.split('_');
  const monthIndex = parts.indexOf('months');
  let contractTermMonths = parseInt(parts[monthIndex - 1], 10);
  if (isNaN(contractTermMonths)) contractTermMonths = 12;
  return contractTermMonths;
};

export default getPlanTerm;
