import UserMembership from '../../../models/userMembership.model';
import HubspotClient from '../../../hubspot-client/hubspot-client';
import parseGHPlan from '../../../parse-gh-plan/parse-gh-plan';

export const getPlanType = (ghPlan: any): any => {
  if (ghPlan.gh_membership_type === 'plan_gh_allin') {
    ghPlan.gh_membership_type = 'plan_gh_all_in';
  } else if (ghPlan.gh_membership_type === 'plan_gh_allinlocal') {
    ghPlan.gh_membership_type = 'plan_gh_all_in_local';
  } else if (ghPlan.gh_membership_type === 'plan_gh_traveler') {
    ghPlan.gh_membership_type = 'plan_gh_weekender';
  }

  const location = ghPlan.gh_membership_location.toLowerCase();
  if (location === 'anylocation') ghPlan.gh_membership_location = '';
  if (location === 'truckee') ghPlan.gh_membership_location = 'Tahoe';

  return ghPlan;
};

const userMembershipToHubspot = async (userMembership: UserMembership, options?: any): Promise<any> => {
  const user = await userMembership.$get('user');
  const sub = await userMembership.$get('subscription');

  if (user && sub) {
    const hubspotClient = HubspotClient.getInstance();

    const parsedPlanId = getPlanType(parseGHPlan(sub.stripePlanId));

    const isPif = sub.stripePlanId.includes('_pif');
    const capOne = sub.stripePlanId.includes('c1') ? 'Yes_Capital_One_Member' : 'Not_Capital_One_Member';

    const properties: any = [
      { property: 'duration', value: parsedPlanId.gh_membership_duration },
      { property: 'gh_membership_location', value: parsedPlanId.gh_membership_location },
      { property: 'gh_membership_type', value: parsedPlanId.gh_membership_type },
      { property: 'gh_membership_group_type', value: parsedPlanId.gh_membership_group_type },
      { property: 'pif_or_monthly', value: isPif ? 'PIF' : 'Monthly' },
      { property: 'is_a_capital_one_member', value: capOne },
      { property: 'referral_code', value: 'Membership Upgraded' },
    ];

    return hubspotClient.createOrUpdateContactByEmail(user.email, properties);
  }
};

export default userMembershipToHubspot;
