import HttpRequestMock from 'http-request-mock';

import StripeClient from '../stripe-client';

const Client = new StripeClient();

describe('getCustomerById', () => {
  describe('success', () => {
    it('should return a stripe customer by an id', async () => {
      const stripeCustomerId = 'cus_123';
      const mocker = HttpRequestMock.setup();

      mocker.mock({
        url: 'https://api.stripe.com/v1/customers/',
        method: 'get',
        status: 200,
        body: {
          id: stripeCustomerId,
        },
      });

      const result = await Client.getCustomerById(stripeCustomerId);
      expect(result.id).toEqual(stripeCustomerId);
    });
  });
});
