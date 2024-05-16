import HttpRequestMock from 'http-request-mock';
import MindBody from '../mindbody-client';

describe('add client', () => {
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
    it('should add a new client', async () => {
      const random = Math.floor(1000 + Math.random() * 9000);
      const email = `test-${random}@gravityhaus.com`;
      const name = `test${random}`;

      const client = {
        FirstName: name,
        LastName: `${random}`,
        MobilePhone: '(970) 555-5555',
        Email: email,
        AddressLine1: '',
        City: '',
        State: '',
        PostalCode: '',
        BirthDate: '',
        IsProspect: true,
        ProspectStage: { Id: 8 },
        Notes: 'test',
      };

      const mocker = HttpRequestMock.setup();

      mocker.mock({
        url: 'https://api.mindbodyonline.com/public/v6/client/addclient',
        method: 'post',
        status: 200,
        body: { Client: client },
      });

      const newClient = await mindBodyClient.addClient(client);

      expect(newClient.Email).toEqual(email);
      expect(newClient.FirstName).toEqual(name);
      expect(newClient.LastName).toEqual(`${random}`);
    });
  });
});
