import { JwtPayload, verify } from 'jsonwebtoken';

/**
 * throws an error that the fass api can return
 *
 * @param {event} event - a lambda event
 *
 * @returns {string} The decoded token.
 * @returns {JwtPayload} The decoded token.
 *
 */
export default (event: any): string | JwtPayload => {
  const token = `${event.headers.Authorization}`.replace('Bearer ', '').trim();
  return verify(token, `${process.env.JWT_SECRET_KEY}`);
};
