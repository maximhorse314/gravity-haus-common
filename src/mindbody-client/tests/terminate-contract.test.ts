import HttpRequestMock from 'http-request-mock';
import MindBody from '../mindbody-client';

describe('terminateContracts', () => {
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
    it('should look up a client by email get contracts and term them', async () => {
      const mocker = HttpRequestMock.setup();

      mocker.mock({
        url: 'https://api.mindbodyonline.com/public/v6/client/clients',
        method: 'get',
        status: 200,
        body: { Clients: [{ Id: 100062454 }] },
      });

      mocker.mock({
        url: 'https://api.mindbodyonline.com/public/v6/client/clientcontracts',
        method: 'get',
        status: 200,
        body: { Contracts: [{ Id: 20468 }] },
      });

      mocker.mock({
        url: 'https://api.mindbodyonline.com/public/v6/client/terminateContract',
        method: 'post',
        status: 200,
        body: { Message: 'The ClientContractID 20468 has been terminated successfully.' },
      });

      const terminatedContracts = await mindBodyClient.terminateContracts('test-6744@gravityhaus.com');
      expect(terminatedContracts[0]).toEqual('The ClientContractID 20468 has been terminated successfully.');
    });
  });
});

// const random = Math.floor(1000 + Math.random() * 9000);
// const email = `test-${random}@gravityhaus.com`
// console.log(email)

// const name = `test${random}`
// console.log(name)

// const client = {
//   "FirstName": `test${random}`,
//   "LastName": `${random}`,
//   "MobilePhone": '(970) 555-5555',
//   "Email": email,
//   "AddressLine1": "",
//   "City": "",
//   "State": "",
//   "PostalCode": "",
//   "BirthDate": "",
//   "IsProspect": true,
//   "ProspectStage":{"Id":8},
//   "Notes": "test"
// }
// const newClient = await mindBodyClient.addClient(client);
// console.log('newClient', newClient)
