import HttpRequestMock from 'http-request-mock';
import StripeClient, { SubscriptionListStatusEnum } from '../stripe-client';

const Client = new StripeClient();

const stripeSearchUrl = 'https://api.stripe.com/v1/subscription';

describe('getAllSubscription', () => {
  jest.setTimeout(1000000);
  describe('success', () => {
    it('should not call itself when has_more is false', async () => {
      const mocker = HttpRequestMock.setup();
      mocker.mock({
        times: 1,
        url: stripeSearchUrl,
        method: 'get',
        status: 200,
        header: {
          'content-type': 'application/json',
        },
        body: {
          data: [{ id: 1 }],
          has_more: false,
        },
      });

      const result = await Client.getAllSubscription({ status: SubscriptionListStatusEnum.ALL });
      expect(result?.length).toEqual(1);
    });
  });
});
