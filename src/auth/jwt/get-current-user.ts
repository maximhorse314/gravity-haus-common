import { APIGatewayProxyEvent } from 'aws-lambda';
import { JwtPayload, decode } from 'jsonwebtoken';

import Client from '../../db/client';
import User, { UserAttributes } from '../../models/user.model';

interface UserIDJwtPayload extends JwtPayload {
  id: number;
}

const getCurrentUser = async (event: APIGatewayProxyEvent): Promise<UserAttributes> => {
  Client.getInstance([User]);
  const token = `${event.headers.Authorization}`.replace('Bearer ', '').trim();
  const { id } = decode(token) as UserIDJwtPayload;
  return User.findByPk(id);
};


export default getCurrentUser;
