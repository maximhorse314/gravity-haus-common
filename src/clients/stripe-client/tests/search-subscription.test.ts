import HttpRequestMock from 'http-request-mock';
import StripeClient from '../stripe-client';

const Client = new StripeClient();

const stripeSearchUrl = 'https://api.stripe.com/v1/subscriptions/search';

describe('searchSubscription', () => {
  describe('success', () => {
    it('should not call subscriptions search when it has no more', async () => {
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

      const result = await Client.searchSubscription();
      expect(result?.length).toEqual(1);
    });

    // skip have to mock the stripe npm to check if it is calling itself and be able to change has_more to false
    it.skip('should call its self when stripe returns has_more', async () => {
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
          has_more: true,
        },
      });

      const result = await Client.searchSubscription();
      expect(result?.length).toEqual(2);
    });
  });

  describe('failure', () => {
    it('should return an error from stripe', async () => {
      const mocker = HttpRequestMock.setup();

      mocker.mock({
        url: stripeSearchUrl,
        method: 'get',
        status: 400,
        body: {
          error: {
            type: 'invalid_request_error',
          },
        },
      });

      try {
        await Client.searchSubscription();
        // Fail test if above expression doesn't throw anything.
        expect(true).toBe(false);
      } catch (error) {
        expect(error.rawType).toBe('invalid_request_error');
      }
    });
  });
});
