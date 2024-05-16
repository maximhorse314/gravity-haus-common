import User from '../../../models/user.model';
import HubspotClient from '../../../hubspot-client/hubspot-client';

const userToHubspot = async (user: User, options?: any): Promise<any> => {
  const hubspotClient = HubspotClient.getInstance();

  let previousValues = user.previous();
  if (!previousValues.id) {
    previousValues = user;
  }

  if (!previousValues.email.includes('DEACTIVATED__')) {
    const properties = [{ property: 'email', value: user.email }];
    return hubspotClient.createOrUpdateContactByEmail(previousValues.email, properties);
  }
};

export default userToHubspot;
