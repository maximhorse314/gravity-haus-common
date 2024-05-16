import axios from 'axios';

import eventbrite from 'eventbrite';

/**
 * singleton class to connect to the stripe api
 * @returns a connection the the stipe client
 */
export class EventBriteClient {
  static instance: EventBriteClient;
  client: any;
  headers: any;

  private constructor() {
    this.client = eventbrite({ token: process.env.EVEN_BRIGHT_TOKEN });

    this.headers = {
      'Content-Type': 'application/json',
      params: {
        token: process.env.EVEN_BRIGHT_TOKEN,
      },
    };
  }

  /**
   * returns or creates a new EventBriteClient
   * @returns EventBriteClient with a valid instance
   */
  public static getInstance(): EventBriteClient {
    if (!EventBriteClient.instance) {
      EventBriteClient.instance = new EventBriteClient();
    }
    return EventBriteClient.instance;
  }

  public async getAttendees(
    organizations: string = '449107090358',
    eventBrightAttendees: any[] = [],
    continuation?: string,
  ): Promise<any> {
    const baseUrl = `/organizations/${organizations}/attendees`;
    const url = continuation ? `${baseUrl}?continuation=${continuation}` : `${baseUrl}`;

    const attendees = await this.client.request(url);

    const allAttendees = [...attendees.attendees, ...eventBrightAttendees];
    if (attendees.pagination.has_more_items) {
      return await this.getAttendees(organizations, allAttendees, attendees.pagination.continuation);
    }

    return allAttendees;
  }
}

export default EventBriteClient;
