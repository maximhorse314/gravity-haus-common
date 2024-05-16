import axios from 'axios';
import { Client } from '../../db/client';
import EventWebhook from '../../models/eventWebhook.model';

export const cancelAll = async (userIds: number[], event: any): Promise<any[]> => {
  Client.getInstance([EventWebhook]);

  const webhooks = await EventWebhook.findAll({ raw: true, where: { eventType: 'cancel-all', active: true } });
  const hooks = webhooks.map((hook) => {
    return {
      url: hook.url,
      participants: userIds,
    };
  });

  const headers = {
    headers: {
      Authorization: `${event.headers.Authorization}`,
      'Access-Control-Allow-Headers': 'Content-Type, X-Amz-Date, Authorization, X-Api-Key, x-requested-with',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*',
    },
  };

  const events = hooks
    .map((webhook) => {
      return webhook.participants.map(async (participant) => {
        try {
          return axios.post(webhook.url, { id: participant }, headers);
        } catch (error) {
          return error;
        }
      });
    })
    .flat();

  return Promise.all(events);
};

export default cancelAll;
