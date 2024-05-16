import StripeClass from './stripe-client';

export class C1Stripe extends StripeClass {
  static instance: C1Stripe;

  private constructor(apiKey: string = `${process.env.STRIPE_C1_API_KEY}`) {
    super(apiKey);
  }

  /**
   * Creates or returns a StripeClient
   * @returns StripeClient with a valid instance
   */
  public static getInstance(apiKey?: string): C1Stripe {
    if (!C1Stripe.instance) {
      C1Stripe.instance = new C1Stripe(apiKey);
    }
    return C1Stripe.instance;
  }
}

export default C1Stripe;
