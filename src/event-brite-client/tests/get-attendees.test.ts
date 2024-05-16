import HttpRequestMock from 'http-request-mock';
import eventBrite from '../event-brite-client';

describe('getClientByEmail', () => {
  let eventBriteClient;

  beforeEach(async () => {
    eventBriteClient = await eventBrite.getInstance();
  });

  afterEach(async () => {});

  describe('success', () => {
    it('should return a 200', async () => {
      const mocker = HttpRequestMock.setup();

      mocker.mock({
        url: `https://www.eventbriteapi.com/v3/`,
        method: 'GET',
        status: 200,
        header: {
          'content-type': 'application/json',
        },
        body: {
          attendees: [{ email: 'woo@whoo.com' }],
          pagination: {
            has_more_items: false,
          },
        },
      });

      try {
        const result = await eventBriteClient.getAttendees();
        expect(result.length).toBe(1);
      } catch (error) {
        console.log(error);
      }
    });
  });
});
