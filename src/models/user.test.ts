import Client from '../db/client';

import User from './user.model';
import Account from './account.model';
import Address from './address.model';
import Phone from './phone.model';

// TODO: set up database factories for gh-common and exclude them from the build
describe('getClientByEmail', () => {
  describe('success', () => {
    jest.setTimeout(1000000000);
    it.skip('should return a 200', async () => {
      try {
        Client.getInstance();

        // await Account.create({
        //   userId: 1,
        //   firstName: 'test',
        //   lastName: 'test',
        // })

        // const address = await Address.findByPk(1);

        // await address.update({
        //   address1: '1235678'
        // })

        const phone = await Phone.findByPk(1);

        await phone.update({
          number: 13031234568,
        });

        // const account = await Account.findByPk(1);
        // await account.update({ phoneId: 1 });

        // const user = await User.findByPk(1)
        // console.log('user', user)
        // await user.update({ email: 'localfamily7@test.com' })
      } catch (error) {
        // console.log(error);
      }
    });
  });
});
