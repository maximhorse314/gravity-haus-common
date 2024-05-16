import axios from 'axios';
import throttledQueue from 'throttled-queue';

export interface ContractInfoType {
  contractId: number;
  locationId: number;
  siteId: number;
}

const contactInfoDefaults: ContractInfoType = {
  contractId: 268,
  locationId: 1,
  siteId: 17163,
};

export interface CreditCardInfoType {
  CreditCardNumber: string;
  ExpMonth: string;
  ExpYear: string;
  BillingName: string;
  BillingAddress: string;
  BillingCity: string;
  BillingState: string;
  BillingPostalCode: string;
  SaveInfo: boolean;
}

// Singleton made easy with TypeScript https://medium.com/javascript-everyday/singleton-made-easy-with-typescript-6ad55a7ba7ff

/**
 * singleton class to connect to the stripe api
 * @returns a connection the the stipe client
 */
export class MindbodyClient {
  static instance: MindbodyClient;
  headers: any;
  baseUrl: string = 'https://api.mindbodyonline.com/public/v6/';

  private constructor() {}

  /**
   * Find a Mindbody Client by email
   * @param apiKey api key of the site you want auth for
   * @param apiKey api key of the site you want auth for
   * DOCS: https://developers.mindbodyonline.com/PublicDocumentation/V6#authentication:~:text=headers.-,User%20Tokens,-Example%20request%20to
   * @returns set the headers to use in other calls
   */
  public async setMindbodyHeaders(apiKey: string = process.env.MBO_API_KEY, thirdPartySiteId: number = 17163) {
    const url = `${this.baseUrl}usertoken/issue`;
    const body = {
      Username: process.env.MBO_USER_NAME,
      Password: process.env.MBO_PASSWORD,
    };

    const headers = {
      headers: {
        'Content-Type': 'application/json',
        'API-key': apiKey,
        SiteId: thirdPartySiteId,
      },
    };

    const authToken = await axios.post(url, body, headers);
    MindbodyClient.instance.headers = {
      headers: {
        Authorization: authToken.data.AccessToken,
        'API-key': apiKey,
        SiteId: thirdPartySiteId,
      },
    };
  }

  /**
   *
   * @returns MindbodyClient with a valid instance
   */
  public static async getInstance(apiKey?: string, thirdPartySiteId: number = 17163): Promise<MindbodyClient> {
    if (!MindbodyClient.instance) {
      MindbodyClient.instance = new MindbodyClient();
    }
    await MindbodyClient.instance.setMindbodyHeaders(apiKey, thirdPartySiteId);
    return MindbodyClient.instance;
  }

  /**
   * Find a Mindbody Client by email
   * @param email of the mindbody client
   * @returns a list of clients
   */
  public async getClientByEmail(email: string): Promise<any[]> {
    const url = `${this.baseUrl}client/clients?SearchText=${email}`;
    const mboClients = await axios.get(url, this.headers);
    return mboClients.data?.Clients || [];
  }

  /**
   * Find a Mindbody Clients by emails
   * @param emails array of emails
   * @returns a list of clients
   */
  public async getClientsByEmails(emails: string[]): Promise<any[]> {
    const throttle = throttledQueue(25, 1000);
    const mboClients = emails.map(async (email) => {
      return throttle(async () => {
        const client = await this.getClientByEmail(email);
        return client[0];
      });
    });

    return Promise.all(mboClients);
  }

  /**
   * Find a Mindbody Client contracts by clientId
   * @param clientId Id of the client in mbo
   * @returns a list of clients contracts
   */
  public async getClientContracts(clientId): Promise<any> {
    const url = `${this.baseUrl}client/clientcontracts?clientId=${clientId}`;
    const contracts = await axios.get(url, this.headers);
    return contracts.data.Contracts;
  }

  /**
   * purchase a contract for a Client
   * @param email of the mbo client
   * @param creditCardInfo CreditCardInfoType to pass to the contract
   * @param contactInfo details about the contract
   * @returns a list of clients contracts
   */
  public async purchaseClientContract(
    email: string,
    creditCardInfo: CreditCardInfoType,
    contactInfo: ContractInfoType = contactInfoDefaults,
  ): Promise<any> {
    const client = await this.getClientByEmail(email);
    const clientId = client[0].Id;

    const startDate = new Date().toISOString().split('T')[0];
    const endDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0];

    const url = `${this.baseUrl}sale/purchasecontract`;

    const body = {
      ClientId: `${clientId}`,
      AgreementDate: startDate,
      StartDate: startDate, // '2022-09-01' This will error unless the contract starts on the first of the month. Support said this is a setting we can change on the contract.
      EndDate: endDate,
      ContractId: contactInfo.contractId,
      LocationId: contactInfo.locationId,
      SiteId: contactInfo.siteId,
      CreditCardInfo: creditCardInfo,
    };

    const crontract = await axios.post(url, body, this.headers);
    return crontract.data;
  }

  /**
   * add a new client to MBO
   * @param client Properties of a mbo client
   * @returns a new client
   */
  public async addClient(client: any): Promise<any> {
    const url = `${this.baseUrl}client/addclient`;
    const mboClient = await axios.post(url, client, this.headers);
    return mboClient.data.Client;
  }

  /**
   * get all locations from MBO
   * @returns a list of locations
   */
  public async getLocations(): Promise<any[]> {
    const url = `${this.baseUrl}site/locations`;
    const locations = await axios.get(url, this.headers);
    return locations.data.Locations;
  }

  /**
   * get all locations from MBO
   * @param email to look up the mbo user id
   * @param terminationDate date string to terminate the contracts
   * @param terminationCode reason from temination the contract defaults to "Moving"
   * @param terminationComments notes defaults to "No fee"
   * @returns a list of locations
   */
  public async terminateContracts(
    email: string,
    terminationDate: string = '',
    terminationCode: string = 'Moving',
    terminationComments: string = 'No fee',
  ): Promise<any> {
    const client = await this.getClientByEmail(email);
    const clientId = client[0].Id;
    const contracts = await this.getClientContracts(clientId);

    const termDate = terminationDate ? new Date(terminationDate) : new Date();
    const url = `${this.baseUrl}client/terminateContract`;

    const termContracts = contracts.map(async (contract) => {
      const body = {
        ClientId: `${clientId}`,
        ClientContractId: contract.Id,
        TerminationDate: termDate.toISOString().split('T')[0],
        TerminationCode: terminationCode,
        TerminationComments: terminationComments,
      };
      const result = await axios.post(url, body, this.headers);
      return result.data.Message;
    });
    const terms = await Promise.all(termContracts);

    return terms;
  }

  // // bug with MBO api breaks once offset its over 2960
  // public async getMindbodyClients(clients: any[] = [], offset: number = 0) {
  //   // console.log('offset', offset);
  //   // console.log('headers', this.headers);

  // const url = `${this.baseUrl}client/clients?limit=200&offset=${offset}`;
  // const mboClients = await axios.get(url, this.headers);
  // const allClients = [...clients, ...mboClients.data.Clients];

  // if (mboClients.data.PaginationResponse.TotalResults >= allClients.length) {
  //   const off = offset + 200;
  //   return await this.getMindbodyClients(allClients, off);
  // }

  // return allClients;
  // }

  /**
   * Find a Mindbody Client by email
   * @param email
   * @param clientProperties
   * @param crossRegionalUpdate
   * @returns mindbody client
   */
  public async updateClientPropertiesByEmail(
    email: string,
    clientProperties: any,
    crossRegionalUpdate: boolean = false,
  ): Promise<any> {
    const client = await this.getClientByEmail(email);
    const clientId = client[0].Id;

    return this.updateClientPropertiesById(clientId, clientProperties, crossRegionalUpdate);
  }

  /**
   * Find a Mindbody Client by email
   * @param mindbodyClientId
   * @param clientProperties
   *  @param crossRegionalUpdate
   * @returns mindbody client
   */
  public async updateClientPropertiesById(
    mindbodyClientId: number,
    clientProperties: any,
    crossRegionalUpdate: boolean = false,
  ): Promise<any> {
    const url = `${this.baseUrl}client/updateclient?ClientIds=${mindbodyClientId}`;
    const body = {
      Client: {
        id: mindbodyClientId,
        ...clientProperties,
      },
      CrossRegionalUpdate: crossRegionalUpdate,
    };

    return axios.post(url, body, this.headers);
  }

  /**
   * Find a Mindbody Client contracts by clientId
   * @param email Email to look up mbo client id
   * @param endDate The date past which class visits are not
   * @param startDate The date before which class visits are not
   * @param offset The number of booking to skip. will pass this to itself
   * @param gymBookings collection of gym bookings . will pass this to itself
   * @param clientId Id of the client in mbo
   * @returns a list of clients contracts
   */
  public async getClientGymBooking(
    email: string,
    endDate: string = `${new Date().toISOString().split('T')[0]}T00:00:00`,
    startDate: string = '2000-01-01T00:00:00',
    offset: number = 0,
    gymBookings: any[] = [],
    clientId?: number,
  ): Promise<any> {
    const throttle = throttledQueue(2000, 60000);
    return throttle(async () => {
      let id = clientId;
      if (!id) {
        const client = await this.getClientByEmail(email);
        id = client[0]?.Id;
      }

      if (!id) {
        return [];
      }

      const url = `${this.baseUrl}client/clientvisits?limit=200&offset=${offset}&ClientId=${id}&StartDate=${startDate}&EndDate=${endDate}`;
      const mboGymBookings = await axios.get(url, this.headers);

      const allBookings = [...gymBookings, ...mboGymBookings.data.Visits];

      if (mboGymBookings.data.PaginationResponse.TotalResults !== allBookings.length) {
        const off = offset + 200;
        return await this.getClientGymBooking(email, endDate, startDate, off, allBookings, id);
      }

      return allBookings;
    });
  }
}

export default MindbodyClient;
