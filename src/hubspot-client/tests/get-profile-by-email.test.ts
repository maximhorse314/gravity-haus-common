import HttpRequestMock from 'http-request-mock';
import HClient from '../hubspot-client';

const hubspotClient = HClient.getInstance();
const v1ApiUrl = 'https://api.hubapi.com/contacts/v1';

describe('getProfileByEmail', () => {
  describe('success', () => {
    it('should return a 200', async () => {
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

      const result = await hubspotClient.getProfileByEmail('email@email.com');
      expect(result.data.vid).toEqual('512');
    });
  });

  describe('failure', () => {
    it('should return 500', async () => {
      const mocker = HttpRequestMock.setup();

      // https://developers.hubspot.com/docs/api/crm/contacts
      mocker.mock({
        url: `${v1ApiUrl}/contact/email`,
        method: 'get',
        status: 500,
        header: {
          'content-type': 'application/json',
        },
        body: { message: 'An error occurred.' },
      });

      try {
        await hubspotClient.getProfileByEmail('email@email.com');
        // Fail test if above expression doesn't throw anything.
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toBe('Request failed with status code 500');
      }
    });
  });
});
