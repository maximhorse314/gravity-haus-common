import User from '../../../models/user.model';
import Account from '../../../models/account.model';

import Address from '../../../models/address.model';
import HubspotClient from '../../../hubspot-client/hubspot-client';
import { Op } from 'sequelize';

const addressToHubspot = async (address: Address, options?: any): Promise<any> => {
  const account = await Account.findOne({
    where: {
      [Op.or]: [{ billingAddressId: address.id }, { mailingAddressId: address.id }],
    },
    include: [{ model: User, as: 'user' }],
  });

  if (account?.user) {
    const hubspotClient = HubspotClient.getInstance();

    const properties: any = [
      { property: 'address', value: address.address1 },
      { property: 'city', value: address.city },
      { property: 'state', value: address.state },
      { property: 'zip', value: address.postalCode },
    ];

    return hubspotClient.createOrUpdateContactByEmail(account.user.email, properties);
  }
};

export default addressToHubspot;
