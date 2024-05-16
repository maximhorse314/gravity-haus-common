import { APIGatewayProxyResult } from 'aws-lambda';
import { Client } from '../db/client';

const corsHeaders = {
  'Access-Control-Allow-Headers': 'Content-Type, X-Amz-Date, Authorization, X-Api-Key, x-requested-with',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': '*',
};

/**
 * @param statusCode status code of the response
 * @param body object with any key value
 * @param headers subscriptionID - the id of the stripe subscription
 * @returns APIGatewayProxyResult closed db connection and returns a APIGatewayProxyResult wiht a statusCode, headers, body
 */
export const response = (statusCode: number, body: any, headers: any = {}): APIGatewayProxyResult => {
  // Hacky: when in the NODE_ENV test, DO NOT close the db connection. Jest global setup will handle that for us.
  // When NODE_ENV is not equal to test (prod, stage, development), I think it is a smart choice to always disconnect from the db when returning from a lambda
  if (process.env.NODE_ENV !== 'test') {
    Client.close(); // close the db connect when responding to a request
  }

  return {
    statusCode,
    headers: { ...corsHeaders, ...headers },
    body: JSON.stringify({ ...body }),
  };
};

export default response;
