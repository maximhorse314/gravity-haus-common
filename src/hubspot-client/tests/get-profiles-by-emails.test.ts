import HttpRequestMock from 'http-request-mock';
import HClient from '../hubspot-client';

const hubspotClient = HClient.getInstance();
const v1ApiUrl = 'https://api.hubapi.com/contacts/v1';

describe('getProfilesByEmails', () => {
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

      const result = await hubspotClient.getProfilesByEmails(['email@email.com']);
      expect(result.length).toEqual(1);
      expect(result[0].vid).toEqual('512');
    });

    it('should return a contact with out and id if an error is thrown from hubspot', async () => {
      const email = 'email@email.com';
      const mocker = HttpRequestMock.setup();

      mocker.mock({
        url: `${v1ApiUrl}/contact/email`,
        method: 'get',
        status: 400,
        header: {
          'content-type': 'application/json',
        },
        body: {},
      });

      const result = await hubspotClient.getProfilesByEmails([email]);
      expect(result.length).toEqual(1);
      expect(result[0].vid).toEqual(undefined);
      expect(result[0].email.value).toEqual(email);
    });
  });
});
