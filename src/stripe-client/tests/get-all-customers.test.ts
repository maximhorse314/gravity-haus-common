import HttpRequestMock from 'http-request-mock';
import StripeClient from '../stripe-client';

const Client = StripeClient.getInstance();

const stripeSearchUrl = 'https://api.stripe.com/v1/customers';

describe('getAllCustomers', () => {
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

      const result = await Client.getAllCustomers();
      expect(result?.length).toEqual(1);
    });

    // Have to figure out how to mock the stripe npm over mock request. this will run then error because it will make a real request to stripe
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

      const result = await Client.getAllCustomers();
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
        await Client.getAllCustomers();
        // Fail test if above expression doesn't throw anything.
        expect(true).toBe(false);
      } catch (error) {
        expect(error.rawType).toBe('invalid_request_error');
      }
    });
  });
});
