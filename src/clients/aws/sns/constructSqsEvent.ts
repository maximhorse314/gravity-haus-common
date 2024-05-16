import { SQSEvent } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';

const capitalizeFirstLetter = (value: string) => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};

const getSqsNameFromFilePath = (value: string) => {
  return value
    .split('-')
    .map((x) => capitalizeFirstLetter(x))
    .join('');
};

export class LazyLoadSqsError extends Error {
  constructor(message) {
    super(message);
    this.name = 'LazyLoadSqsError';
  }
}

export const constructSqsEvent = (message: any, sqsFileName: string = 'SqsQueueName'): SQSEvent => {
  return {
    Records: [
      {
        messageId: uuidv4(),
        receiptHandle: uuidv4(),
        body: JSON.stringify({ Message: JSON.stringify(message) }),
        attributes: {
          ApproximateReceiveCount: '1',
          SentTimestamp: uuidv4(),
          SenderId: uuidv4(),
          ApproximateFirstReceiveTimestamp: uuidv4(),
        },
        messageAttributes: {},
        md5OfBody: uuidv4(),
        eventSource: 'aws:sqs',
        eventSourceARN: `arn:aws:sqs:us-east-2:975893632143:${getSqsNameFromFilePath(sqsFileName)}`,
        awsRegion: 'us-east-2',
      },
    ],
  };
};

export default constructSqsEvent;
