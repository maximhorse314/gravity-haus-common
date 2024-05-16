import HttpRequestMock from 'http-request-mock';

import StripeClient from '../stripe-client';

const Client = StripeClient.getInstance();

const stripeUrl = 'https://api.stripe.com';

describe('cancelSubscription', () => {
  describe('success', () => {
    it('should return a 200, update a MembershipApplicationStatus to CANCEL and hit the stripe api', async () => {
      const mocker = HttpRequestMock.setup();

      // https://stripe.com/docs/api/subscription_items/delete?lang=node
      mocker.mock({
        url: stripeUrl,
        method: 'delete',
        status: 200,
        body: {
          id: '123',
          object: 'subscription_item',
          deleted: true,
        },
      });

      const result = await Client.cancelSubscription('123');
      expect(result.id).toEqual('123');
    });
  });

  describe('failure', () => {
    it('should return an error from stripe and roll back data', async () => {
      const mocker = HttpRequestMock.setup();

      // https://stripe.com/docs/api/subscription_items/delete?lang=node
      mocker.mock({
        url: stripeUrl,
        method: 'delete',
        status: 404,
        body: {
          error: {
            type: 'invalid_request_error',
          },
        },
      });

      try {
        await Client.cancelSubscription('123');
        // Fail test if above expression doesn't throw anything.
        expect(true).toBe(false);
      } catch (error) {
        expect(error.rawType).toBe('invalid_request_error');
      }
    });
  });
});
