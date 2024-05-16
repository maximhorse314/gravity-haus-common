import MembershipApplicationStatus, { StatusEnum } from '../../../models/membershipApplicationStatus.model';
import HubspotClient from '../../../hubspot-client/hubspot-client';

const getGhContactType = (status: string): string => {
  switch (status) {
    case StatusEnum.NEW:
      return 'Member';
    case StatusEnum.UNDER_REVIEW:
      return 'Canceled';
    case StatusEnum.APPROVE:
      return 'Member';
    case StatusEnum.OVERDUE:
      return 'Past_Due';
    case StatusEnum.CANCEL:
      return 'Canceled';
    case StatusEnum.COUPON_FAILED:
      return 'Canceled';
    case StatusEnum.STRIPE_FAILED:
      return 'Canceled';
    default:
      return 'Non-member';
  }
};

const membershipApplicationStatusToHubspot = async (
  membershipApplicationStatus: MembershipApplicationStatus,
  options?: any,
): Promise<any> => {
  const user = await membershipApplicationStatus.$get('user');
  if (user) {
    const hubspotClient = HubspotClient.getInstance();

    const membershipRenewalDate = new Date(membershipApplicationStatus.renewalDate);

    const properties: any = [
      { property: 'gh_contact_type', value: getGhContactType(membershipApplicationStatus.status) },
      { property: 'group_code', value: membershipApplicationStatus?.stripeCoupon || '' },
      { property: 'membership_renewal_date', value: membershipRenewalDate.setUTCHours(0, 0, 0, 0) },
    ];

    return hubspotClient.createOrUpdateContactByEmail(user.email, properties);
  }
};

export default membershipApplicationStatusToHubspot;
