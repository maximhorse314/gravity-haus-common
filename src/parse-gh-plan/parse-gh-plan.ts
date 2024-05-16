import capitalizeFirstLetter from '../capitalize-first-letter/capitalize-first-letter';

const getParsedGHPan = (parsedGHPan) => {
  return {
    gh_membership_type: parsedGHPan[0] + '_' + parsedGHPan[1] + '_' + parsedGHPan[2],
    gh_membership_group_type: parsedGHPan.length > 3 ? capitalizeFirstLetter(parsedGHPan[3]) : '',
    gh_membership_location: parsedGHPan.length > 4 ? capitalizeFirstLetter(parsedGHPan[4]) : '',
    gh_membership_duration: parsedGHPan.length > 5 ? parsedGHPan[5] + '_' + parsedGHPan[6] : '',
  };
};

// check if its old style membership eg. plan_gh_explorer_12_months
const checkForOldMembershipStyle = (ghPlan, ghPlanId) => {
  if (
    ghPlan.gh_membership_group_type !== 'Individual' &&
    ghPlan.gh_membership_group_type !== 'Family' &&
    ghPlan.gh_membership_group_type !== 'Corporate'
  ) {
    ghPlan.gh_membership_type = ghPlanId;
    ghPlan.gh_membership_group_type = '';
    ghPlan.gh_membership_location = '';
    ghPlan.gh_membership_duration = '';
  }
};

export const parseGHPlan = (
  planId: string,
): {
  gh_membership_type: string;
  gh_membership_group_type: string;
  gh_membership_location: string;
  gh_membership_duration: string;
} => {
  // example: plan_gh_weekender_family_anylocation_12_months
  const ghPlanId = planId.replace('c1', '');

  const locationMap = {
    Winterpark: 'Winter_Park',
  };

  const parsedGHPan = ghPlanId.split('_');
  const ghPlan = getParsedGHPan(parsedGHPan);
  checkForOldMembershipStyle(ghPlan, ghPlanId);

  const locationMappedValue = locationMap[ghPlan.gh_membership_location];
  if (locationMappedValue) {
    ghPlan.gh_membership_location = locationMappedValue;
  }

  return ghPlan;
};

export default parseGHPlan;
