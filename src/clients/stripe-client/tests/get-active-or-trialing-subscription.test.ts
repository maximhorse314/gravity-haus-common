import StripeClient from '../stripe-client';

const Client = new StripeClient();

describe('getAllActiveSubscription', () => {
  describe('success', () => {
    it('should call searchSubscription with the right query', async () => {
      let spy = jest.spyOn(StripeClient.prototype, 'searchSubscription').mockImplementation();
      await Client.getAllActiveSubscription();
      expect(spy).toBeCalledWith({ query: "status:'active'" });
    });
  });
});
