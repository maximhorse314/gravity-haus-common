import HttpRequestMock from 'http-request-mock';
import HClient, { v1ApiUrl } from '../hubspot-client';

const hubspotClient = HClient.getInstance();

describe('updateContactProperties', () => {
  describe('success', () => {
    it('should send a request to update a property', async () => {
      const mocker = HttpRequestMock.setup();

      mocker.mock({
        url: `${v1ApiUrl}/contact/email`,
        method: 'get',
        status: 200,
        header: {
          'content-type': 'application/json',
        },
        body: {
          vid: '512',
        },
      });

      mocker.mock({
        url: 'https://api.hubapi.com',
        method: 'patch',
        status: 200,
        header: {
          'content-type': 'application/json',
        },
        body: {
          id: '512',
          properties: {
            email: 'test@test.com',
            requested_reach_out: 'Yes',
          },
        },
      });

      const properties = { requested_reach_out: 'Yes' };
      const result = await hubspotClient.updateContactProperties(properties, 'test@test.com');
      expect(result.id).toEqual('512');
    });
  });
});
