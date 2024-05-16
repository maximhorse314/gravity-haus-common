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
    it('should return a 200', async () => {
      const mocker = HttpRequestMock.setup();

      mocker.mock({
        url: 'https://api.mindbodyonline.com/public/v6/client/clients',
        method: 'get',
        status: 200,
        body: { Clients: [{ Id: 123 }, { Id: 456 }] },
      });

      const result = await mindBodyClient.getClientByEmail('123');
      expect(result.length).toBe(2);
    });
  });
});
