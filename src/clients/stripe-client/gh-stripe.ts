import StripeClass from './stripe-client';

export class GhStripe extends StripeClass {
  static instance: GhStripe;

  private constructor(apiKey: string = `${process.env.STRIPE_API_KEY}`) {
    super(apiKey);
  }

  /**
   * Creates or returns a StripeClient
   * @returns StripeClient with a valid instance
   */
  public static getInstance(apiKey?: string): GhStripe {
    if (!GhStripe.instance) {
      GhStripe.instance = new GhStripe(apiKey);
    }
    return GhStripe.instance;
  }
}

export default GhStripe;
