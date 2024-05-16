import StripeClient from '../stripe-client';

const Client = StripeClient.getInstance();

describe('getAllActiveSubscription', () => {
  describe('success', () => {
    it('should call searchSubscription with the right query', async () => {
      let spy = jest.spyOn(StripeClient.prototype, 'searchSubscription').mockImplementation();
      await Client.getAllActiveSubscription();
      expect(spy).toBeCalledWith("status:'active'");
    });
  });
});
