import HttpRequestMock from 'http-request-mock';
import HClient from '../hubspot-client';

const hubspotClient = HClient.getInstance();

describe('selfOptedToCancel', () => {
  describe('success', () => {
    it('should return a 200', async () => {
      const mocker = HttpRequestMock.setup();

      // https://developers.hubspot.com/docs/api/crm/contacts
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
            self_opted_to_cancel: 'Yes_Self_Opted_To_Cancel',
          },
        },
      });

      const result = await hubspotClient.selfOptedToCancel('hubspotID', true);
      expect(result.id).toEqual('512');
    });
  });

  describe('failure', () => {
    it('should throw error if hubspot returns an error', async () => {
      const mocker = HttpRequestMock.setup();

      // https://developers.hubspot.com/docs/api/crm/contacts
      mocker.mock({
        url: 'https://api.hubapi.com',
        method: 'patch',
        status: 500,
        header: {
          'content-type': 'application/json',
        },
        body: { message: 'An error occurred.' },
      });

      try {
        await hubspotClient.selfOptedToCancel('hubspotID', true);
        // Fail test if above expression doesn't throw anything.
        expect(true).toBe(false);
      } catch (error) {
        expect(error.body.message).toBe('An error occurred.');
      }
    });
  });
});
