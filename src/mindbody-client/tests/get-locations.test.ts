import HttpRequestMock from 'http-request-mock';
import MindBody from '../mindbody-client';

describe('getLocations', () => {
  const OLD_ENV = process.env;

  let mindBodyClient;

  beforeEach(async () => {
    process.env = {
      ...OLD_ENV,
      MBO_USER_NAME: 'name',
      MBO_PASSWORD: 'password',
      MBO_API_KEY: 'apiKey',
    };

    // mock the mbo usertoken call
    const mocker = HttpRequestMock.setup();
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
    it('should return a list of locations', async () => {
      const location = { Id: 1 };
      const mocker = HttpRequestMock.setup();

      mocker.mock({
        url: 'https://api.mindbodyonline.com/public/v6/site/locations',
        method: 'get',
        status: 200,
        body: { Locations: [location] },
      });

      const locations = await mindBodyClient.getLocations();
      expect(locations[0].Id).toEqual(location.Id);
    });
  });
});
