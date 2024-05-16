import Stripe from 'stripe';
import { APIGatewayProxyEvent } from 'aws-lambda';
import throttledQueue from 'throttled-queue';

import axios from 'axios';
import csvToJson from 'csvtojson';

import sleep from '../../utils/sleep';

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

const defaultubScriptionSearchParams = {
  query: "status:'active'",
};

export class StripeClient {
  client: Stripe;
  throttle: any;
  apiKey: any;

  constructor(apiKey: string = `${process.env.STRIPE_API_KEY}`) {
    this.client = new Stripe(`${apiKey}`, { apiVersion: '2022-08-01' });
    this.throttle = throttledQueue(80, 1000);
    this.apiKey = apiKey;
  }

  /**
   * Deletes an item from the subscription. Removing a subscription item from a subscription will not cancel the subscription.
   * @param subscriptionID subscriptionID - the id of the stripe subscription
   * @returns DeletedSubscriptionItem https://stripe.com/docs/api/subscription_items/delete?lang=node
   */
  public cancelSubscription(
    subscriptionID: string,
    params: Stripe.SubscriptionDeleteParams = {},
  ): Promise<Stripe.Subscription> {
    return this.client.subscriptions.del(subscriptionID, params);
  }

  /**
   * Recursively calls subscriptions to search and returns an array of active subscriptions
   * @returns https://stripe.com/docs/api/subscriptions/search
   */
  public getAllActiveSubscription(
    params: Stripe.SubscriptionSearchParams = defaultubScriptionSearchParams,
  ): Promise<Stripe.Subscription[]> {
    return this.searchSubscription({ ...params, query: "status:'active'" });
  }

  /**
   * Recursively calls subscriptions to search and returns an array of canceled subscriptions
   * @returns https://stripe.com/docs/api/subscriptions/search
   */
  public getAllCanceledSubscription(
    params: Stripe.SubscriptionSearchParams = {
      query: "status:'canceled'",
    },
  ): Promise<Stripe.Subscription[]> {
    return this.searchSubscription({ ...params, query: "status:'canceled'" });
  }

  /**
   * Recursively calls subscriptions to search and returns an array of active subscriptions
   * https://stripe.com/docs/api/subscriptions/search
   * @returns stripe subscriptions that have a status of active or trialing
   */
  public getActiveOrTrialingSubscription(
    params: Stripe.SubscriptionSearchParams = {
      query: "status:'active' OR status:'trialing'",
    },
  ): Promise<Stripe.Subscription[]> {
    return this.searchSubscription({ ...params, query: "status:'active' OR status:'trialing'" });
  }

  /**
   * Recursively calls subscriptions to search and returns an array of active subscriptions
   * https://stripe.com/docs/api/subscriptions/search
   * @returns stripe subscriptions that match a query
   */
  public async searchSubscription(
    // query: string = "status:'active'",
    params: Stripe.SubscriptionSearchParams = defaultubScriptionSearchParams,
    subscriptions: Stripe.Subscription[] = [],
    page?: string,
  ): Promise<Stripe.Subscription[]> {
    return this.throttle(async () => {
      const stripeSubscriptions = await this.client.subscriptions.search({
        // query,
        limit: 100,
        page,
        // expand: ['data.customer'],
        ...params,
      });

      const subs = [...subscriptions, ...stripeSubscriptions.data];

      if (stripeSubscriptions.has_more && stripeSubscriptions.next_page) {
        const retry = [await sleep(200), await this.searchSubscription(params, subs, stripeSubscriptions.next_page)];
        const [_, values] = await Promise.all(retry);
        return values;
      } else {
        return subs;
      }
    });
  }

  /**
   * get all subscriptions in stripe. Recursively calls its self until there are no nore subscriptions
   * @param params https://stripe.com/docs/api/subscriptions/list#:~:text=status%3Dcanceled.-,Parameters,-cus
   * @param subscriptions subscriptions that will be added to the return value
   * @param startingAfter page of subscriptions to look up
   * @returns https://stripe.com/docs/api/subscriptions/list
   */
  public async getAllSubscription(
    params?: Stripe.SubscriptionListParams,
    subscriptions: any = [],
    startingAfter?: string,
  ): Promise<Stripe.Subscription[]> {
    return this.throttle(async () => {
      const stripeSubscriptions = await this.client.subscriptions.list({
        limit: 100,
        ...params,
        starting_after: startingAfter,
      });

      const subscriptionsList = [...subscriptions, ...stripeSubscriptions.data];

      if (stripeSubscriptions.has_more) {
        const after = stripeSubscriptions.data[stripeSubscriptions.data.length - 1].id;
        return await this.getAllSubscription(params, subscriptionsList, after);
      } else {
        return subscriptionsList;
      }
    });
  }

  /**
   * get a stripe customer by an customer ID
   * @param customerId the id of the customer in stripe
   * @returns stripe customer by an id
   */
  public getCustomerById(customerId: string): Promise<Stripe.Response<Stripe.Customer | Stripe.DeletedCustomer>> {
    return this.client.customers.retrieve(customerId, {
      expand: ['subscriptions', 'default_source', 'discount', 'sources'],
    });
  }

  /**
   * get a stripe customer by an customer ID
   * @param invoiceId the id of the customer in stripe
   * @returns stripe invoice by an id
   */
  public retrieveInvoice(invoiceId: string): Promise<Stripe.Invoice> {
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
    const customers = customerIds.map(async (id) => {
      return this.throttle(async () => {
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
  public async getAllCustomers(customers: any = [], startingAfter?: string): Promise<Stripe.Customer[]> {
    const stripeCustomers = await this.client.customers.list({
      limit: 100,
      starting_after: startingAfter,
      expand: ['data.subscriptions'],
    });

    const customerList = [...customers, ...stripeCustomers.data];

    if (stripeCustomers.has_more) {
      const after = stripeCustomers.data[stripeCustomers.data.length - 1].id;
      const customersArray = await this.getAllCustomers(customerList, after);
      return customersArray;
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
  ): Promise<Stripe.Invoice[]> {
    return this.throttle(async () => {
      const stripeInvoices = await this.client.invoices.search({
        query,
        limit: 100,
        page,
      });

      const invoiceList = [...invoices, ...stripeInvoices.data];

      if (stripeInvoices.next_page && stripeInvoices.has_more && paginate) {
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
  public getSubscriptionInvoices(subscriptionId: string): Promise<Stripe.Invoice[]> {
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
  public createCustomer(customerInfo: Stripe.CustomerCreateParams): Promise<Stripe.Customer> {
    return this.client.customers.create(
      customerInfo,
      //   {
      //   source: customerInfo.cardTokenId,
      //   name: customerInfo.fullName,
      //   email: customerInfo.email,
      //   phone: customerInfo.phone,
      //   metadata: {
      //     userId: customerInfo.userId,
      //     accountId: customerInfo.accountId,
      //   },
      // }
    );
  }

  /**
   * Updates Stripe customer info
   * @param customerId Id of the stripe customer
   * @param customerInfo StripeCustomerType
   * @returns a stripe customer object
   * https://stripe.com/docs/api/customers/update
   */
  public updateCustomer(customerId: string, customerInfo: Stripe.CustomerUpdateParams): Promise<Stripe.Customer> {
    return this.client.customers.update(customerId, customerInfo);
  }

  /**
   * @param subscriptionId Id of the stripe customer
   * @param customerInfo StripeCustomerType
   * @returns a stripe customer object
   * https://stripe.com/docs/api/customers/update
   */
  public updateSubscription(subscriptionId: string, data: any): Promise<Stripe.Subscription> {
    return this.client.subscriptions.update(subscriptionId, data);
  }

  /**
   * @param query  The search query string https://stripe.com/docs/search#query-fields-for-charges
   * @param paginate Should this function use pagination or just return the first 100 records found
   * @param charges array of charges: passes to itself
   * @param page A cursor for pagination across multiple pages of results: https://stripe.com/docs/api/charges/search#search_charges-page
   * @returns array of stripe charges https://stripe.com/docs/api/charges/object
   */
  public async searchCharges(
    query: string,
    paginate: boolean = true,
    charges: any = [],
    page?: string,
  ): Promise<Stripe.Charge[]> {
    return this.throttle(async () => {
      const stripeCharges = await this.client.charges.search({
        query,
        limit: 100,
        page,
      });

      const chargeList = [...charges, ...stripeCharges.data];

      if (stripeCharges.next_page && stripeCharges.has_more && paginate) {
        return await this.searchCharges(query, paginate, chargeList, stripeCharges.next_page);
      } else {
        return chargeList;
      }
    });
  }

  /**
   * @param params Stripe.RefundListParams
   * @param refunds Not required, an array of stripe refunds the function will pass to itself
   * @param startingAfter Not required, A cursor for use in pagination. The function will pass to itself. https://stripe.com/docs/api/refunds/list#list_refunds-starting_after
   * @returns https://stripe.com/docs/api/payouts/list
   */
  public listPayouts(
    params: Stripe.PayoutListParams,
    payouts: Stripe.Payout[] = [],
    startingAfter?: string,
  ): Promise<any> {
    return this.throttle(async () => {
      const stripePayout = await this.client.payouts.list({ ...params, starting_after: startingAfter });

      const payoutList = [...payouts, ...stripePayout.data];

      if (stripePayout.has_more) {
        const after = stripePayout.data[stripePayout.data.length - 1].id;
        return await this.listPayouts(params, payoutList, after);
      } else {
        return payoutList;
      }
    });
  }

  /**
   *
   * @param params Stripe.RefundListParams
   * @param refunds Not required, an array of stripe refunds the function will pass to itself
   * @param startingAfter Not required, A cursor for use in pagination. The function will pass to itself. https://stripe.com/docs/api/refunds/list#list_refunds-starting_after
   * @returns https://stripe.com/docs/api/refunds/list
   */
  public async listRefunds(
    params: Stripe.RefundListParams,
    refunds: Stripe.Refund[] = [],
    startingAfter?: string,
  ): Promise<Stripe.Refund[]> {
    return this.throttle(async () => {
      const stripeRefunds = await this.client.refunds.list({ ...params, starting_after: startingAfter });

      const refundList = [...refunds, ...stripeRefunds.data];

      if (stripeRefunds.has_more) {
        const after = stripeRefunds.data[stripeRefunds.data.length - 1].id;
        return await this.listRefunds(params, refundList, after);
      } else {
        return refundList;
      }
    });
  }

  /**
   * Recursively call itself until all disputes matching the query are found
   * @param params Stripe.BalanceTransactionListParams
   * @param transactions Not required, an array of stripe disputes the function will pass to itself
   * @param startingAfter Not required, A cursor for use in pagination. The function will pass to itself. https://stripe.com/docs/api/balance_transactions/list#balance_transaction_list-starting_after
   * @returns https://stripe.com/docs/api/balance_transactions/list
   */
  public async listBalanceTransactions(
    params: Stripe.BalanceTransactionListParams,
    transactions: Stripe.BalanceTransaction[] = [],
    startingAfter?: string,
  ): Promise<Stripe.BalanceTransaction[]> {
    return this.throttle(async () => {
      const stripeTransactions = await this.client.balanceTransactions.list({
        ...params,
        starting_after: startingAfter,
      });

      const transactionList = [...transactions, ...stripeTransactions.data];

      if (stripeTransactions.has_more) {
        const after = stripeTransactions.data[stripeTransactions.data.length - 1].id;
        return await this.listBalanceTransactions(params, transactionList, after);
      } else {
        return transactionList;
      }
    });
  }

  /**
   * Recursively call itself until all disputes matching the query are found
   * @param params Stripe.DisputeListParams
   * @param disputes Not required, an array of stripe disputes the function will pass to itself
   * @param startingAfter Not required, A cursor for use in pagination. The function will pass to itself. https://stripe.com/docs/api/disputes/list#list_disputes-starting_after
   * @returns https://stripe.com/docs/api/disputes/list
   */
  public async listDisputes(
    params: Stripe.DisputeListParams,
    disputes: any = [],
    startingAfter?: string,
  ): Promise<Stripe.Dispute[]> {
    return this.throttle(async () => {
      const stripeDisputes = await this.client.disputes.list({ ...params, starting_after: startingAfter });

      const disputList = [...disputes, ...stripeDisputes.data];

      if (stripeDisputes.has_more) {
        const after = stripeDisputes.data[stripeDisputes.data.length - 1].id;
        return await this.listDisputes(params, disputList, after);
      } else {
        return disputList;
      }
    });
  }

  /**
   * Recursively call itself with a report id until the status is not pending.
   * @param id the id of a report
   * @returns
   */
  private retrieveReportType = async (id: string): Promise<Stripe.Reporting.ReportRun> => {
    return this.throttle(async () => {
      const reportType = await this.client.reporting.reportRuns.retrieve(id);

      if (reportType.status === 'pending') {
        await sleep(200);
        return this.retrieveReportType(id);
      }
      return reportType;
    });
  };

  /**
   * @param start date to search greater than
   * @param end date to search less than
   * @returns https://stripe.com/docs/reports/report-types#schema-connected-account-payout-reconciliation-itemized-5
   */
  public async getPayoutReconciliation(start: Date, end: Date): Promise<any> {
    const startTimestampInSeconds = Math.floor(new Date(start).getTime() / 1000);
    const endTimestampInSeconds = Math.floor(new Date(end).getTime() / 1000);

    const reportRun = await this.client.reporting.reportRuns.create({
      report_type: 'payout_reconciliation.itemized.5',
      parameters: {
        timezone: 'America/Denver',
        interval_start: startTimestampInSeconds,
        interval_end: endTimestampInSeconds,
        columns: [
          'customer_id',
          'customer_email',
          'charge_id',
          'gross',
          'net',
          'fee',
          'automatic_payout_id',
          'automatic_payout_effective_at',
          'created',
          'available_on',
          'description',
        ],
      },
    });

    const reportType = await this.retrieveReportType(reportRun.id);

    const reportCsv = await axios(reportType.result.url, {
      auth: { username: this.apiKey, password: '' },
    });

    const json = await csvToJson().fromString(reportCsv.data);

    return json;
  }

  /**
   * @param start date to search greater than
   * @param end date to search less than
   * @returns https://stripe.com/docs/reports/report-types#schema-connected-account-balance-change-from-activity-itemized-3
   */
  public async getBalanceChangeFromActivity(start: Date, end: Date): Promise<any> {
    const startTimestampInSeconds = Math.floor(new Date(start).getTime() / 1000);
    const endTimestampInSeconds = Math.floor(new Date(end).getTime() / 1000);

    const reportRun = await this.client.reporting.reportRuns.create({
      report_type: 'balance_change_from_activity.itemized.3',
      parameters: {
        timezone: 'America/Denver',
        interval_start: startTimestampInSeconds,
        interval_end: endTimestampInSeconds,
        columns: [
          'customer_id',
          'subscription_id',
          'customer_email',
          'charge_id',
          'gross',
          'net',
          'fee',
          'automatic_payout_id',
          'automatic_payout_effective_at',
          'created',
          'available_on',
          'description',
        ],
      },
    });

    const reportType = await this.retrieveReportType(reportRun.id);

    const reportCsv = await axios(reportType.result.url, {
      auth: { username: this.apiKey, password: '' },
    });

    const json = await csvToJson().fromString(reportCsv.data);

    return json;
  }

  /**
   * get a stripe subscription by an subscription ID https://stripe.com/docs/api/subscriptions/retrieve
   * @param subscriptionId the id of the subscription in stripe
   * @returns stripe subscription by an id https://stripe.com/docs/api/subscriptions/object
   */
  public getSubscriptionById(subscriptionId: string): Promise<Stripe.Response<Stripe.Subscription>> {
    return this.client.subscriptions.retrieve(subscriptionId);
  }

  /**
   * get a stripe subscription by an subscription ID https://stripe.com/docs/api/subscriptions/retrieve
   * @param subscriptionId the id of the subscription in stripe
   * @returns stripe subscription by an id https://stripe.com/docs/api/subscriptions/object
   */

  public createSubscription(
    params: Stripe.SubscriptionCreateParams,
    options?: Stripe.RequestOptions,
  ): Promise<Stripe.Response<Stripe.Subscription>> {
    return this.client.subscriptions.create(params, options);
  }

  /**
   * get stripe subscriptions by an array of subscription IDs
   * @param subscriptionIds the ids of the subscription in stripe
   * @returns array of stripe subscriptions https://stripe.com/docs/api/subscriptions/object
   */
  public getSubscriptionsByIds(subscriptionIds: string[]): Promise<Stripe.Subscription[]> {
    const subscriptions = subscriptionIds.map(async (id) => {
      return this.throttle(async () => {
        const subscription = await this.getSubscriptionById(id);
        return subscription;
      });
    });
    return Promise.all(subscriptions);
  }

  public createSubscriptionSchedule(
    params?: Stripe.SubscriptionScheduleCreateParams,
    options?: Stripe.RequestOptions,
  ): Promise<Stripe.SubscriptionSchedule> {
    return this.client.subscriptionSchedules.create(params, options);
  }

  public getPrice(id: string, params?: Stripe.SubscriptionScheduleCreateParams): Promise<Stripe.Price> {
    return this.client.prices.retrieve(id, params);
  }
}

export default StripeClient;
