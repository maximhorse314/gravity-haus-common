import { sign } from 'jsonwebtoken';

import verify from './verify-token';

describe('verify-token', () => {
  describe('success', () => {
    it('should verify a token header with Bearer in it', async () => {
      const token = sign({}, `${process.env.JWT_SECRET_KEY}`, { expiresIn: '2 days' });
      const event = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      expect(() => verify(event)).not.toThrow();
    });

    it('should verify a token header without Bearer in it', async () => {
      const token = sign({}, `${process.env.JWT_SECRET_KEY}`, { expiresIn: '2 days' });
      const event = {
        headers: {
          Authorization: `${token}`,
        },
      };

      expect(() => verify(event)).not.toThrow();
    });
  });

  describe('failure', () => {
    it('should throw error when token is invalid', async () => {
      const event = {
        headers: {
          Authorization: `bad token`,
        },
      };

      expect(() => verify(event)).toThrow();
    });
  });
});
