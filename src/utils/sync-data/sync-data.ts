import { Model } from 'sequelize-typescript';

import accountToHubspot from './utils/account-to-hubspot';
import addressToHubspot from './utils/address-to-hubspot';
import phoneToHubspot from './utils/phone-to-hubspot';
import userToHubspot from './utils/user-to-hubspot';
import membershipApplicationStatusToHubspot from './utils/membership-application-status-to-hubspot';
import userMembershipToHubspot from './utils/user-membership-to-hubspot';

export enum AllowedModels {
  USER = 'User',
  ACCOUNT = 'Account',
  ADDRESS = 'Address',
  PHONE = 'Phone',
  MEMBERSHIP_APPLICATION_STATUS = 'MembershipApplicationStatus',
  USER_MEMBERSHIP = 'UserMembership',
}

const syncMembershipApplicationStatus = async (instance: any, options: any): Promise<any> => {
  await membershipApplicationStatusToHubspot(instance, options);
};

const syncUserMembership = async (instance: any, options: any): Promise<any> => {
  await userMembershipToHubspot(instance, options);
};

const syncUser = async (instance: any, options: any): Promise<any> => {
  await userToHubspot(instance, options);
};

const syncAccount = async (instance: any, options: any): Promise<any> => {
  await accountToHubspot(instance, options);
};

const syncAddress = async (instance: any, options: any): Promise<any> => {
  await addressToHubspot(instance, options);
};

const syncPhone = async (instance: any, options: any): Promise<any> => {
  await phoneToHubspot(instance, options);
};

const syncData = async (model: AllowedModels, instance: Model, options: any): Promise<any> => {
  switch (model) {
    case AllowedModels.USER:
      await syncUser(instance, options);
      break;
    case AllowedModels.ACCOUNT:
      await syncAccount(instance, options);
      break;
    case AllowedModels.ADDRESS:
      await syncAddress(instance, options);
      break;
    case AllowedModels.PHONE:
      await syncPhone(instance, options);
      break;
    case AllowedModels.USER_MEMBERSHIP:
      await syncUserMembership(instance, options);
      break;
    case AllowedModels.MEMBERSHIP_APPLICATION_STATUS:
      await syncMembershipApplicationStatus(instance, options);
      break;
    default:
      return;
  }
};

export default syncData;
