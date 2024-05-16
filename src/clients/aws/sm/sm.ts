import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

/**
 * singleton class to connect to the stripe api
 * @returns a connection the the stipe client
 */
export class SM {
  static instance: SM;
  client: SecretsManagerClient;
  secret: any;

  private constructor() {
    this.client = new SecretsManagerClient({ region: 'us-east-1' });
  }

  /**
   * returns or creates a new SM
   * @returns SM with a valid instance
   */
  public static getInstance(): SM {
    if (!SM.instance) {
      SM.instance = new SM();
    }
    return SM.instance;
  }

  /**
   * gets secret value and saves it to the instance as JSON
   * @returns object of secret
   */
  public async getSecret(
    evnName: string = process.env.ENV || 'dev', // dev | stage | prod
    secretName: string = process.env.SECRET_NAME,
  ): Promise<any> {
    if (this.secret) return this.secret; // return secret if already fetched

    if (!process.env.SCRIPT && process.env.LOCAL_FAAS === 'true') return { ...process.env }; // return .env when on local env

    const secretId = `${secretName}/${evnName}`;
    let response;

    try {
      response = await this.client.send(
        new GetSecretValueCommand({
          SecretId: secretId,
          VersionStage: 'AWSCURRENT',
        }),
      );
    } catch (error) {
      // For a list of exceptions thrown, see
      // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
      throw error;
    }

    SM.instance.secret = JSON.parse(response.SecretString);

    process.env = { ...process.env, ...SM.instance.secret };

    return SM.instance.secret;
  }
}

export default SM;
