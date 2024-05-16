import StripeClient from '../stripe-client';

const Client = StripeClient.getInstance();

describe('getActiveOrTrialingSubscription', () => {
  describe('success', () => {
    it('should call searchSubscription with the right query', async () => {
      let spy = jest.spyOn(StripeClient.prototype, 'searchSubscription').mockImplementation();
      await Client.getActiveOrTrialingSubscription();
      expect(spy).toBeCalledWith("status:'active' OR status:'trialing'");
    });
  });
});
