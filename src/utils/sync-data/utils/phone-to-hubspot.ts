import User from '../../../models/user.model';
import Account from '../../../models/account.model';
import Phone from '../../../models/phone.model';
import HubspotClient from '../../../hubspot-client/hubspot-client';

const phoneToHubspot = async (phone: Phone, options?: any): Promise<any> => {
  const account = await Account.findOne({
    where: {
      phoneId: phone.id,
    },
    include: [{ model: User, as: 'user' }],
  });

  if (account?.user) {
    const hubspotClient = HubspotClient.getInstance();

    const properties: any = [{ property: 'phone', value: `${phone.number}` }];

    return hubspotClient.createOrUpdateContactByEmail(account.user.email, properties);
  }
};

export default phoneToHubspot;
