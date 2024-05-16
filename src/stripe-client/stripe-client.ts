import Stripe from 'stripe';
import { APIGatewayProxyEvent } from 'aws-lambda';
import throttledQueue from 'throttled-queue';

export interface StripeCustomerType {
  cardTokenId: string;
  fullName: string;
  email: string;
  phone: string;
  userId: number;
  accountId: number;
}

export enum SubscriptionListStatusEnum {
  ACTIVE = 'active',
  ALL = 'all',
  PAST_DUE = 'past_due',
  UNPAID = 'unpaid',
  CANCELED = 'canceled',
  INCOMPLETE = 'incomplete',
  INCOMPLETE_EXPIRED = 'incomplete_expired',
  TRIALING = 'trialing',
  ENDED = 'ended',
}

// Singleton made easy with TypeScript https://medium.com/javascript-everyday/singleton-made-easy-with-typescript-6ad55a7ba7ff

/**
 * singleton class to connect to the stripe api
 * @returns a connection the the stipe client
 */
export class StripeClient {
  static instance: StripeClient;
  client?: Stripe;

  private constructor(apiKey: string = process.env.STRIPE_API_KEY) {
    this.client = new Stripe(`${apiKey}`, { apiVersion: '2022-08-01' });
  }

  /**
   * Creates or returns a StripeClient
   * @returns StripeClient with a valid instance
   */
  public static getInstance(apiKey?: string): StripeClient {
    if (!StripeClient.instance) {
      StripeClient.instance = new StripeClient(apiKey);
    }
    return StripeClient.instance;
  }

  /**
   * Deletes an item from the subscription. Removing a subscription item from a subscription will not cancel the subscription.
   * @param subscriptionID subscriptionID - the id of the stripe subscription
   * @returns DeletedSubscriptionItem https://stripe.com/docs/api/subscription_items/delete?lang=node
   */
  public cancelSubscription(subscriptionID: string): Promise<Stripe.Response<Stripe.Subscription>> {
    return this.client.subscriptions.del(subscriptionID);
  }

  /**
   * Recursively calls subscriptions to search and returns an array of active subscriptions
   * @returns https://stripe.com/docs/api/subscriptions/search
   */
  public getAllActiveSubscription(): Promise<Stripe.ApiSearchResultPromise<Stripe.Subscription>[]> {
    return this.searchSubscription("status:'active'");
  }

  /**
   * Recursively calls subscriptions to search and returns an array of active subscriptions
   * https://stripe.com/docs/api/subscriptions/search
   * @returns stripe subscriptions that have a status of active or trialing
   */
  public getActiveOrTrialingSubscription(): Promise<Stripe.ApiSearchResultPromise<Stripe.Subscription>[]> {
    return this.searchSubscription("status:'active' OR status:'trialing'");
  }

  /**
   * Recursively calls subscriptions to search and returns an array of active subscriptions
   * https://stripe.com/docs/api/subscriptions/search
   * @returns stripe subscriptions that match a query
   */
  public async searchSubscription(
    query: string = "status:'active'",
    subscriptions: any = [],
    page?: string,
  ): Promise<Stripe.ApiSearchResultPromise<Stripe.Subscription>[]> {
    const stripeSubscriptions = await this.client.subscriptions.search({
      query,
      limit: 100,
      page,
    });

    const subs = [...subscriptions, ...stripeSubscriptions.data];

    if (stripeSubscriptions.has_more) {
      return await this.searchSubscription(query, subs, stripeSubscriptions.next_page);
    } else {
      return subs;
    }
  }

  /**
   * get all subscriptions in stripe. Recursively calls its self until there are no nore subscriptions
   * @param subscriptions subscriptions that will be added to the return value
   * @param startingAfter page of subscriptions to look up
   * @returns array of stripe subscriptions
   */
  public async getAllSubscription(
    status?: SubscriptionListStatusEnum,
    subscriptions: any = [],
    startingAfter?: string,
  ): Promise<Stripe.ApiListPromise<Stripe.Subscription>[]> {
    const stripeSubscriptions = await this.client.subscriptions.list({
      status,
      limit: 100,
      starting_after: startingAfter,
    });

    const subscriptionsList = [...subscriptions, ...stripeSubscriptions.data];

    if (stripeSubscriptions.has_more) {
      const after = stripeSubscriptions.data[stripeSubscriptions.data.length - 1].id;
      return await this.getAllSubscription(status, subscriptionsList, after);
    } else {
      return subscriptionsList;
    }
  }

  /**
   * get a stripe customer by an customer ID
   * @param customerId the id of the customer in stripe
   * @returns stripe customer by an id
   */
  public getCustomerById(customerId: string): Promise<Stripe.Response<Stripe.Customer | Stripe.DeletedCustomer>> {
    return this.client.customers.retrieve(customerId);
  }

  /**
   * get a stripe customer by an customer ID
   * @param invoiceId the id of the customer in stripe
   * @returns stripe invoice by an id
   */
  public retrieveInvoice(invoiceId: string): Promise<Stripe.Response<Stripe.Invoice>> {
    return this.client.invoices.retrieve(invoiceId);
  }

  /**
   * get a stripe customer by an array of customer IDs
   * @param customerIds the ids of the customer in stripe
   * @returns array of stripe customers
   */
  public getCustomersByIds(
    customerIds: string[],
  ): Promise<Stripe.Response<Stripe.Customer | Stripe.DeletedCustomer>[]> {
    const throttle = throttledQueue(25, 1000);
    const customers = customerIds.map(async (id) => {
      return throttle(async () => {
        const customer = await this.getCustomerById(id);
        return customer;
      });
    });
    return Promise.all(customers);
  }

  /**
   * get all customers in stripe. Recursively calls its self until there are no nore customer
   * @param customers customers that will be added to the return value
   * @param startingAfter page of customers to look up
   * @returns array of stripe customers
   */
  public async getAllCustomers(
    customers: any = [],
    startingAfter?: string,
  ): Promise<Stripe.ApiListPromise<Stripe.Customer>[]> {
    const stripeCustomers = await this.client.customers.list({
      limit: 100,
      starting_after: startingAfter,
    });

    const customerList = [...customers, ...stripeCustomers.data];

    if (stripeCustomers.has_more) {
      const after = stripeCustomers.data[stripeCustomers.data.length - 1].id;
      return await this.getAllCustomers(customerList, after);
    } else {
      return customerList;
    }
  }

  /**
   * Verifys that a lambda event is coming from stripe
   * @param query  The search query string https://stripe.com/docs/api/invoices/search#search_invoices-query
   * @param paginate should the retuest find all invoices
   * @param invoices array of invoices: passes to itself
   * @param page A cursor for pagination across multiple pages of results
   * @returns array of stripe invoices
   */
  public async searchInvoices(
    query: string,
    paginate: boolean = true,
    invoices: any = [],
    page?: string,
  ): Promise<Stripe.ApiSearchResultPromise<Stripe.Invoice>[]> {
    const throttle = throttledQueue(25, 1000);
    return throttle(async () => {
      const stripeInvoices = await this.client.invoices.search({
        query,
        limit: 100,
        page,
      });

      const invoiceList = [...invoices, ...stripeInvoices.data];

      if (stripeInvoices.has_more && paginate) {
        return await this.searchInvoices(query, paginate, invoiceList, stripeInvoices.next_page);
      } else {
        return invoiceList;
      }
    });
  }

  /**
   * Recursively calls invoice to search and returns an array of active subscriptions
   * https://stripe.com/docs/api/invoices/search
   * @returns
   */
  public getSubscriptionInvoices(subscriptionId: string): Promise<Stripe.ApiSearchResultPromise<Stripe.Invoice>[]> {
    return this.searchInvoices(`subscription:"${subscriptionId}"`);
  }

  /**
   * Verifys that a lambda event is coming from stripe
   * @param event a lambda event
   * @param endpointSecret webhook secret from stripe webhooks
   * @returns array of stripe customers
   */
  public constructEvent(event: APIGatewayProxyEvent, endpointSecret: string): Stripe.Event {
    const sig = event.headers['Stripe-Signature'] || event.headers['stripe-signature'];
    return this.client.webhooks.constructEvent(event.body, sig, endpointSecret);
  }

  /**
   * Creates a new customer in stripe with customer info
   * @param customerInfo StripeCustomerType
   * https://stripe.com/docs/api/customers/create
   */
  public createCustomer(customerInfo: StripeCustomerType): Promise<Stripe.Response<Stripe.Customer>> {
    return this.client.customers.create({
      source: customerInfo.cardTokenId,
      name: customerInfo.fullName,
      email: customerInfo.email,
      phone: customerInfo.phone,
      metadata: {
        userId: customerInfo.userId,
        accountId: customerInfo.accountId,
      },
    });
  }

  /**
   * Updates Stripe customer info
   * @param customerId Id of the stripe customer
   * @param customerInfo StripeCustomerType
   * @returns a stripe customer object
   * https://stripe.com/docs/api/customers/update
   */
  public updateCustomer(
    customerId: string,
    customerInfo: StripeCustomerType,
  ): Promise<Stripe.Response<Stripe.Customer>> {
    return this.client.customers.update(customerId, {
      source: customerInfo.cardTokenId,
      name: customerInfo.fullName,
      email: customerInfo.email,
      phone: customerInfo.phone,
      metadata: {
        userId: customerInfo.userId,
        accountId: customerInfo.accountId,
      },
    });
  }
}

export default StripeClient;
