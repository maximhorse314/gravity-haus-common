import axios from 'axios';
import { sign, Algorithm } from 'jsonwebtoken';

import SM from '../aws/sm/sm';

/**
 * singleton class to connect to the stripe api
 * @returns a connection the the stipe client
 */
export class Docusign {
  static instance: Docusign;
  headers: any;
  DOCUSIGN_REDIRECT_URI: string;
  DOCUSIGN_AUD: string;
  DOCUSIGN_USER_ID: string;
  DOCUSIGN_INTEGRATION_KEY: string;
  DOCUSIGN_SCOPES: string;
  DOCUSIGN_PUBLIC_AND_PRIVATE_KEY: string;
  DOCUSIGN_ACCOUNT_ID: string;
  DOCUSIGN_BASE_URL: string;

  private constructor() {
    this.DOCUSIGN_REDIRECT_URI = process.env.DOCUSIGN_REDIRECT_URI;
    this.DOCUSIGN_AUD = process.env.DOCUSIGN_AUD;
    this.DOCUSIGN_USER_ID = process.env.DOCUSIGN_USER_ID;
    this.DOCUSIGN_INTEGRATION_KEY = process.env.DOCUSIGN_INTEGRATION_KEY;
    this.DOCUSIGN_SCOPES = process.env.DOCUSIGN_SCOPES;
    this.DOCUSIGN_PUBLIC_AND_PRIVATE_KEY = process.env.DOCUSIGN_PUBLIC_AND_PRIVATE_KEY;
    this.DOCUSIGN_ACCOUNT_ID = process.env.DOCUSIGN_ACCOUNT_ID;
    this.DOCUSIGN_BASE_URL = process.env.DOCUSIGN_BASE_URL;
  }

  /**
   *
   * @returns Docusign with a valid instance
   */
  public static async getInstance(): Promise<Docusign> {
    if (!Docusign.instance) {
      Docusign.instance = new Docusign();
    }
    await Docusign.instance.setHeaders();

    return Docusign.instance;
  }

  /**
   * @param email email of the person who is going to sign
   * @param fullName full name of the signer
   * @param templateId template to use for document
   * @returns a list of clients
   */
  public async createEnvelope(email: string, fullName: string, templateId: string): Promise<any> {
    const eUrl = `https://${Docusign.instance.DOCUSIGN_BASE_URL}/restapi/v2.1/accounts/${Docusign.instance.DOCUSIGN_ACCOUNT_ID}/envelopes`;
    const eData = {
      status: 'sent',
      templateId,
      templateRoles: [
        {
          email,
          name: fullName,
          roleName: 'newMember',
          clientUserId: email,
        },
      ],
    };

    try {
      const envelope = await axios.post(eUrl, eData, Docusign.instance.headers);
      return envelope.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @param email email of the person who is going to sign
   * @param fullName full name of the signer
   * @param returnUrl Url to redirect to after signing is done
   * @param envelopeId Id of the envelope to use
   * @returns a list of clients
   */
  public async getEnvelopeView(email: string, fullName: string, returnUrl: string, envelopeId: string): Promise<any> {
    const data = {
      returnUrl,
      email,
      clientUserId: email,
      userName: fullName,
      authenticationMethod: 'None',
      xFrameOptions: 'allow_from',
      xFrameOptionsAllowFromUrl: Docusign.instance.DOCUSIGN_REDIRECT_URI,
    };

    const url = `https://${Docusign.instance.DOCUSIGN_BASE_URL}/restapi/v2.1/accounts/${Docusign.instance.DOCUSIGN_ACCOUNT_ID}/envelopes/${envelopeId}/views/recipient`;

    const envelopeView = await axios.post(url, data, Docusign.instance.headers);
    return envelopeView.data;
  }

  signToken = (): string => {
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + 6000;

    const tokenBody = {
      iss: Docusign.instance.DOCUSIGN_INTEGRATION_KEY,
      sub: Docusign.instance.DOCUSIGN_USER_ID,
      scope: Docusign.instance.DOCUSIGN_SCOPES,
      aud: Docusign.instance.DOCUSIGN_AUD,
      iat,
      exp,
    };

    const tokenHeader: { algorithm: Algorithm } = { algorithm: 'RS256' };

    const token = sign(tokenBody, Docusign.instance.DOCUSIGN_PUBLIC_AND_PRIVATE_KEY, tokenHeader);

    return token;
  };

  async setHeaders(): Promise<any> {
    const token = Docusign.instance.signToken();

    const url = `https://${Docusign.instance.DOCUSIGN_AUD}/oauth/token`;
    const auth = await axios.post(url, {
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: token,
    });

    Docusign.instance.headers = {
      headers: {
        Authorization: `Bearer ${auth.data.access_token}`,
      },
    };
  }
}

export default Docusign;
