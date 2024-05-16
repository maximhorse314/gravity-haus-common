import HttpRequestMock from 'http-request-mock';
import MindBody from '../mindbody-client';

describe('purchaseClientContract', () => {
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
      const creditCardInfo = {
        CreditCardNumber: '1111111111111111',
        ExpMonth: '11',
        ExpYear: '2028',
        BillingName: 'Cool Dude Guy',
        BillingAddress: '123 sick dr',
        BillingCity: 'denver',
        BillingState: 'CO',
        BillingPostalCode: '80227',
        SaveInfo: false,
      };

      const contactInfo = {
        contractId: 268,
        locationId: 1,
        siteId: 17163,
      };

      const mocker = HttpRequestMock.setup();

      mocker.mock({
        url: 'https://api.mindbodyonline.com/public/v6/client/clients',
        method: 'get',
        status: 200,
        body: { Clients: [{ Id: 100062425 }] },
      });

      mocker.mock({
        url: 'https://api.mindbodyonline.com/public/v6/sale/purchasecontract',
        method: 'post',
        status: 200,
        body: { ClientId: '100062425', LocationId: 1, ContractId: 268 },
      });

      const newContract = await mindBodyClient.purchaseClientContract(
        'test-8729@gravityhaus.com',
        creditCardInfo,
        contactInfo,
      );

      expect(newContract.ClientId).toEqual('100062425');
      expect(newContract.LocationId).toEqual(1);
      expect(newContract.ContractId).toEqual(268);
    });
  });
});
