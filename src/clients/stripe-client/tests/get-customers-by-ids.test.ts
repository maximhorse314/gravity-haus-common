import HttpRequestMock from 'http-request-mock';

import StripeClient from '../stripe-client';

const Client = new StripeClient();

describe('getCustomersByIds', () => {
  describe('success', () => {
    it('should call searchSubscription with the right query', async () => {
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

      const result = await Client.getCustomersByIds([stripeCustomerId, 'cust_2']);
      expect(result.length).toEqual(2);
    });
  });
});
