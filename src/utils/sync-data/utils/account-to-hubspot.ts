import Account from '../../../models/account.model';
import HubspotClient from '../../../hubspot-client/hubspot-client';
import getFormattedDate from '../../../date/get-formatted-date/get-formatted-date';

const accountToHubspot = async (account: Account, options?: any): Promise<any> => {
  const user = await account.$get('user');
  if (user) {
    const hubspotClient = HubspotClient.getInstance();
    const dateOfBirth = new Date(account.dateOfBirth);

    const properties: any = [
      { property: 'firstname', value: account.firstName },
      { property: 'lastName', value: account.lastName },
      { property: 'date_of_birth', value: getFormattedDate(dateOfBirth, 'MM/DD/YYYY') },
      { property: 'birth_date', value: dateOfBirth.setUTCHours(0, 0, 0, 0) },
    ];

    return hubspotClient.createOrUpdateContactByEmail(user.email, properties);
  }
};

export default accountToHubspot;
