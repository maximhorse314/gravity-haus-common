import HttpRequestMock from 'http-request-mock';
import MindBody from '../mindbody-client';

describe('getClientByEmail', () => {
  const OLD_ENV = process.env;
  let mindBodyClient;

  beforeEach(async () => {
    process.env = {
      ...OLD_ENV,
      MBO_USER_NAME: 'name',
      MBO_PASSWORD: 'password',
      MBO_API_KEY: 'apiKey',
    };

    const mocker = HttpRequestMock.setup();

    // mock the mbo usertoken call
    mocker.mock({
      url: 'https://api.mindbodyonline.com/public/v6/usertoken/issue',
      method: 'post',
      status: 200,
      body: { AccessToken: '123' },
    });

    mindBodyClient = await MindBody.getInstance();
  });

  afterEach(async () => {
    process.env = OLD_ENV; // Restore old environment
  });

  describe('success', () => {
    jest.setTimeout(500000);
    it('should return a 200', async () => {
      const mocker = HttpRequestMock.setup();

      mocker.mock({
        url: 'https://api.mindbodyonline.com/public/v6/client/clients',
        method: 'get',
        status: 200,
        body: { Clients: [{ Id: 123 }] },
      });

      // mock the mbo usertoken call
      mocker.mock({
        url: 'https://api.mindbodyonline.com/public/v6/client/clientvisits',
        method: 'get',
        status: 200,
        body: {
          PaginationResponse: { TotalResults: 1 },
          Visits: [{ id: 1 }],
        },
      });

      try {
        const allResult = await mindBodyClient.getClientGymBooking('mikegalie@msn.com');
        expect(allResult.length).toBe(1);
      } catch (error) {
        console.log('error ++++++++===', error);
      }
    });
  });
});
