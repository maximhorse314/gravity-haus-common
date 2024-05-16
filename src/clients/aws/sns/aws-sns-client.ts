import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

import { Client } from '../../../db/client';
import AwsSnsTopic from '../../../models/awsSnsTopic.model';
import constructSqsEvent, { LazyLoadSqsError } from './constructSqsEvent';

const getFunctionPath = (sqsFileName: string): string => {
  // import functions from layers
  let functionPath = `/opt/nodejs/sqs/${sqsFileName}/${sqsFileName}`.toLowerCase();

  if (process.env.LOCAL_FAAS === 'true') {
    // import functions from project src
    functionPath = `${process.cwd()}/src/sqs/${sqsFileName}/${sqsFileName}`.toLowerCase();
  }

  if (process.env.SEEDS === 'true') {
    // import functions from project build
    functionPath = `${process.cwd()}/dist/sqs/${sqsFileName}/${sqsFileName}`.toLowerCase();
  }
  return functionPath;
};

const lazyLoadSqs = async (sqsFileName: string, message: string): Promise<any> => {
  try {
    const event = constructSqsEvent(JSON.parse(message), sqsFileName);

    const functionPath = getFunctionPath(sqsFileName);
    const method = await import(functionPath);
    const result = await method.default(event);

    return result;
  } catch (error) {
    throw new LazyLoadSqsError(error.message);
  }
};

/**
 * singleton class to connect to the stripe api
 * @returns a connection the the stipe client
 */
export class AwsSNSClient {
  static instance: AwsSNSClient;
  client: SNSClient;

  private constructor(region: string = 'us-east-2') {
    this.client = new SNSClient({ region });
  }

  /**
   * returns or creates a new AwsSNSClient
   * @returns AwsSNSClient with a valid instance
   */
  public static getInstance(region: string = 'us-east-2'): AwsSNSClient {
    if (!AwsSNSClient.instance) {
      AwsSNSClient.instance = new AwsSNSClient(region);
    }
    return AwsSNSClient.instance;
  }

  public async publish(name: string, message: string): Promise<any> {
    try {
      Client.getInstance();

      const topic = await AwsSnsTopic.findOne({ where: { name } });
      const topicArn = topic.topicArn;

      // When topic arn equals local lazy load and await the sqs function inline by name
      if (topicArn === 'local') {
        const result = await lazyLoadSqs(name, message);
        return result;
      } else {
        const command = new PublishCommand({
          Message: message,
          TopicArn: topicArn,
        });

        return this.client.send(command);
      }
    } catch (error) {
      throw error;
    }
  }
}

export default AwsSNSClient;
