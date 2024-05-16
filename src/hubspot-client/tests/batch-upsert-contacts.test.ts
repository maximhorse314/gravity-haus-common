import HttpRequestMock from 'http-request-mock';
import HClient, { v1ApiUrl } from '../hubspot-client';

const hubspotClient = HClient.getInstance();

describe('batchUpsertContacts', () => {
  describe('success', () => {
    it('should return a 202', async () => {
      const mocker = HttpRequestMock.setup();

      mocker.mock({
        url: `${v1ApiUrl}/contact/batch`,
        method: 'post',
        status: 202,
        header: {
          'content-type': 'application/json',
        },
        body: {},
      });

      const contactProperties = [
        {
          email: 'poop@tarts.com',
          properties: [{ property: 'cool', value: 'thing' }],
        },
      ];

      const result = await hubspotClient.batchUpsertContacts(contactProperties);
      expect(result[0].status).toEqual(202);
    });
  });
});
