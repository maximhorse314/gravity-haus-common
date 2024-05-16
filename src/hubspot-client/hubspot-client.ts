import axios from 'axios';
import { Client } from '@hubspot/api-client';
import throttledQueue from 'throttled-queue';

import chunkArray from '../utils/chunk-array';

export enum OptedToCancel {
  'YES' = 'Yes_Self_Opted_To_Cancel',
  'NO' = 'No_Self_Opted_To_Cancel',
}

interface HubSpotBatchPropertiesType {
  property: string;
  value: string;
}

export interface HubSpotContactPropertiesType {
  email: string;
  properties: HubSpotBatchPropertiesType[];
}

export interface HubSpotPropertiesType {
  [key: string]: string;
}

export const v1ApiUrl = 'https://api.hubapi.com/contacts/v1';

const authHeaders = () => {
  return {
    Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
    'Content-Type': 'application/json',
  };
};

/**
 * singleton class to connect to the stripe api
 * @returns a connection the the stipe client
 */
export class HubspotClient {
  static instance: HubspotClient;
  client: Client;

  private constructor() {
    this.client = new Client({ accessToken: process.env.HUBSPOT_API_KEY });
  }

  /**
   * returns or creates a new HubspotClient
   * @returns HubspotClient with a valid instance
   */
  public static getInstance(): HubspotClient {
    if (!HubspotClient.instance) {
      HubspotClient.instance = new HubspotClient();
    }
    return HubspotClient.instance;
  }

  /**
   * looks up a hubspot contact by email and updates properties
   * @param properties HubSpotPropertiesType of hubspot contact properties
   * @param email email of the hubspot contact
   * @returns https://developers.hubspot.com/docs/api/crm/contacts
   */
  public async updateContactProperties(properties: HubSpotPropertiesType, email: string): Promise<any> {
    const hubspotProfile = await this.getProfileByEmail(email);

    return this.client.crm.contacts.basicApi.update(hubspotProfile.data.vid, {
      properties,
    });
  }

  /**
   * Updates a hubspot contact self_opted_to_cancel to "Yes_Self_Opted_To_Cancel" or "No_Self_Opted_To_Cancel"
   * @param email email of the hubspot contact
   * @param cancel boolean to assign Option To Cancel enum value
   * @returns https://developers.hubspot.com/docs/api/crm/contacts
   */
  public selfOptedToCancel(hubspotId: string, cancel: boolean = true): Promise<any> {
    const optedToCancel = cancel ? OptedToCancel.YES : OptedToCancel.NO;
    return this.client.crm.contacts.basicApi.update(hubspotId, {
      properties: {
        self_opted_to_cancel: optedToCancel,
      },
    });
  }

  /**
   * Finds a hubspot contact by email
   * @param email email of the hubspot contact
   * @returns https://developers.hubspot.com/docs/api/crm/contacts
   */
  public getProfileByEmail(email: string): Promise<any> {
    const url = `${v1ApiUrl}/contact/email/${email}/profile`;
    return axios.get(url, {
      headers: authHeaders(),
    });
  }

  /**
   * Finds a hubspot contact by emails
   * @param emails emails of the hubspot contact
   * @returns array of hubspot contacts https://developers.hubspot.com/docs/api/crm/contacts
   */
  public getProfilesByEmails(emails: string[]): Promise<any> {
    const throttle = throttledQueue(100, 10000); // https://legacydocs.hubspot.com/apps/api_guidelines

    const contacts = emails.map(async (email) => {
      return throttle(async () => {
        let contact;
        try {
          contact = await this.getProfileByEmail(email);
        } catch (error) {
          return { email: { value: email }, properties: {} };
        }
        return contact.data;
      });
    });

    return Promise.all(contacts);
  }

  /**
   * chunsk contacts into sets of 1000 to upsert hubspot contacts
   * https://legacydocs.hubspot.com/docs/methods/contacts/batch_create_or_update
   * @param contactProperties array of contacts and properties
   * @returns Promise all of request to hubspot batch api
   */
  public batchUpsertContacts(contactProperties: HubSpotContactPropertiesType[]): Promise<any> {
    const chunkContacts = chunkArray(contactProperties, 1000);

    const url = `${v1ApiUrl}/contact/batch`;

    const batches = chunkContacts.map((contacts) => {
      return axios.post(url, contacts, {
        headers: authHeaders(),
      });
    });

    return Promise.all(batches);
  }

  /**
   * Finds a hubspot contact by email
   * @param email email of the hubspot contact
   * @param properties array of HubSpotPropertiesType
   * @returns https://legacydocs.hubspot.com/docs/methods/contacts/create_or_update
   */
  public createOrUpdateContactByEmail(email: string, properties: HubSpotPropertiesType[]): Promise<any> {
    const url = `${v1ApiUrl}/contact/createOrUpdate/email/${email}/`;
    const body = { properties };
    const qs = {
      headers: authHeaders(),
    };

    return axios.post(url, body, qs);
  }
}

export default HubspotClient;
