it.skip('needs tests', () => {});

//////////////
//////////////
//////////////
//////////////
// code below is hacked together and hitting the stripe api. Nothing is mocked out or a real test. left as an example
//////////////
//////////////
//////////////
//////////////

// import HttpRequestMock from 'http-request-mock';
// import fs from 'fs';

// import StripeClient from '../stripe-client';

// import { WebClient, ChatPostMessageArguments, ChatPostMessageResponse } from '@slack/web-api';
// const slackClient = new WebClient(process.env.SLACK_API_KEY);

// const Client = new StripeClient();

// const groupByKey = (list: any[], key: string) =>
//   list.reduce((hash, obj) => ({ ...hash, [obj[key]]: (hash[obj[key]] || []).concat(obj) }), {});

// const getUniqueCustomerSubscriptions = (subscriptions: any[]): any[] => {
//   const customerGroup = groupByKey(subscriptions, 'customer');
//   return Object.entries(customerGroup).map((customer) => {
//     const customerSubscriptions = customer[1] as any[];
//     return customerSubscriptions.reduce((a, b) => (a.created > b.created ? a : b));
//   });
// };

// const getTotal = (list, key, pretty: boolean = true) => {
//   const sum = list.reduce((accumulator, value) => {
//     return accumulator + parseFloat(value[key]);
//   }, 0);

//   let total;
//   if (pretty) {
//     total = (sum / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
//   } else {
//     total = sum / 100;
//   }

//   return total;
// };

// const getTotalValue = (list, key, pretty: boolean = true) => {
//   const sum = list.reduce((accumulator, value) => {
//     return accumulator + parseFloat(value[key]);
//   }, 0);

//   let total;
//   if (pretty) {
//     total = sum.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
//   } else {
//     total = sum;
//   }

//   return total;
// };

// const getTransactionAmountByType = (stripeTransaction, type) => {
//   const transactions = stripeTransaction.filter((x) => {
//     if (x.type === type) {
//       return x;
//     }
//   });

//   const amountTotal = getTotal(transactions, 'amount');
//   const netTotal = getTotal(transactions, 'net');
//   const feesTotal = getTotal(transactions, 'fee');

//   return {
//     amountTotal,
//     netTotal,
//     feesTotal,
//   };
// };

// const isDateBetweenPeriod = (date: Date, periodStartDate: Date, periodEndDate: Date) => {
//   return date.valueOf() >= periodStartDate.valueOf() && date.valueOf() <= periodEndDate.valueOf();
// };

// const jsonToCsv = (items) => {
//   const replacer = (key, value) => (value === null ? '' : value); // specify how you want to handle null values here
//   const header = Object.keys(items[0]);
//   const csv = [
//     header.join(','), // header row first
//     ...items.map((row) => header.map((fieldName) => JSON.stringify(row[fieldName], replacer)).join(',')),
//   ].join('\r\n');
//   return csv;
// };

// const writeCsv = (list, fileName) => {
//   const csv = jsonToCsv(list);

//   fs.writeFile(fileName, csv, 'utf8', () => {
//     return;
//   });
// };

// const getGroupTotal = (values: any, keys: string[], key: string, notKeys: string[] = []): any => {
//   const notInlcuded = !notKeys.length ? false : notKeys.map((x) => values.planId.includes(x)).includes(true);
//   const inlcuded = keys.map((x) => values.planId.includes(x)).includes(true);

//   if (inlcuded && !notInlcuded) {
//     // values.subscription['key'] = key

//     const charges = values.balanceChangeFromActivity.filter((x) => {
//       if (x.subscription_id === values.subscription.id) {
//         return x;
//       }
//     });
//     const netTotal = getTotalValue(charges, 'net', false);

//     const currentCount = values.planIds[key]?.count || 0;
//     const currentTotal = values.planIds[key]?.total || 0;

//     const total = currentTotal + netTotal;
//     const count = currentCount + 1;

//     values.planIds[key] = {
//       count: count,
//       total: total,
//     };
//   }
// };

// describe('searchCharges', () => {
//   jest.setTimeout(1000000);
//   describe('success', () => {
//     it.skip('report', async () => {
//       const getUniqueCustomers = async (balanceChangeFromActivity): Promise<any[]> => {
//         const customerIds = balanceChangeFromActivity.map((x) => x.customer_id).filter((x) => x);
//         const uniqueCustomerIds: string[] = Array.from(new Set(customerIds));

//         const customers: any[] = await Client.getCustomersByIds(uniqueCustomerIds);
//         return customers;
//       };

//       const start = new Date(2022, 10, 1, 0, 0, 0, 0);
//       const end = new Date(2022, 10, 30, 23, 59, 59, 59);
//       const balanceChangeFromActivity = await Client.getBalanceChangeFromActivity(start, end);

//       writeCsv(balanceChangeFromActivity, 'RawBalanceChangeFromActivity.csv');
//     });

//     it.skip('NEW ONE', async () => {
//       const start = new Date(2022, 10, 1, 0, 0, 0, 0);
//       const end = new Date(2022, 10, 30, 23, 59, 59, 59);

//       const balanceChangeFromActivity = await Client.getBalanceChangeFromActivity(start, end);
//       const balanceChangeFromActivityNetTotal = getTotalValue(balanceChangeFromActivity, 'net', false);

//       const customerIds = balanceChangeFromActivity.map((x) => x.customer_id).filter((x) => x);
//       const uniqueCustomerIds: string[] = Array.from(new Set(customerIds));

//       const customers: any[] = await Client.getCustomersByIds(uniqueCustomerIds);
//       const canceledSubs = await Client.getAllCanceledSubscription(); // TODO: look into liminting this serach to the period https://stripe.com/docs/api/subscriptions/list

//       const customerSubMap = customers.map((customer) => {
//         const canceled = canceledSubs.filter((sub) => {
//           return sub.customer === customer.id;
//         });

//         return {
//           ...customer,
//           subscriptions: {
//             data: [...customer.subscriptions.data, ...canceled],
//           },
//         };
//       });

//       const activity = balanceChangeFromActivity.map((a) => {
//         if (!a.subscription_id && a.customer_id) {
//           const customer = customerSubMap.find((cust) => cust.id === a.customer_id);
//           if (customer) {
//             return {
//               ...a,
//               subscription_id: customer.subscriptions.data?.[0]?.id,
//             };
//           }
//         }
//         return a;
//       });
//       const activityNetTotal = getTotalValue(activity, 'net', false);

//       writeCsv(activity, 'balanceChangeFromActivity.csv');

//       const customerSubs = customerSubMap.map((c) => {
//         const subs = c.subscriptions.data.find((s) => {
//           const subPlan = s?.plan?.id || 'plan_gh_unknown';
//           if (!subPlan.includes('addon') && !subPlan.includes('add_on') && subPlan.includes('plan_gh_')) {
//             return s;
//           } else {
//             // console.log('CCCCC', c)
//           }
//         });

//         return subs;
//       });

//       const planIds: any = {};

//       const noSubs = activity.filter((x) => !x.subscription_id && x.customer_id);
//       writeCsv(noSubs, 'noSubs.csv');

//       const noSubsTotal = getTotalValue(noSubs, 'net', false);
//       planIds['noSubs'] = { count: Array.from(new Set(noSubs.map((x) => x.customer_id))).length, total: noSubsTotal };

//       customerSubs.forEach((sc) => {
//         if (sc) {
//           const subscription = sc;
//           const planId = subscription?.plan?.id || 'plan_gh_unknown';
//           const values = {
//             planId,
//             balanceChangeFromActivity: activity,
//             subscription,
//             planIds,
//             customerId: sc.customer,
//           };

//           const allinKeys = ['_allin', '_all_in'];
//           getGroupTotal(values, allinKeys, 'allin', ['local']);

//           const localKeys = ['_local_', 'all_in_local', 'allinlocal'];
//           getGroupTotal(values, localKeys, 'local');

//           const travelerKeys = ['weekender', 'traveler'];
//           getGroupTotal(values, travelerKeys, 'traveler');

//           getGroupTotal(values, ['explorer'], 'explorer');
//           getGroupTotal(values, ['social'], 'social');
//           getGroupTotal(values, ['unknown'], 'unknown');
//           getGroupTotal(values, ['price_1I0C2CGuI3uPg2Uzq39he0fe'], 'price_1I0C2CGuI3uPg2Uzq39he0fe');
//           getGroupTotal(values, ['plan_gh_investor'], 'plan_gh_investor');
//           getGroupTotal(values, ['plan_gh_employee'], 'plan_gh_employee');
//         } else {
//           // console.log('WTF', sc)
//         }
//       });

//       const customerAddons = customerSubMap
//         .map((c) => {
//           const subs = c.subscriptions.data.filter((s) => {
//             const subPlan = s?.plan?.id || '';
//             if (subPlan.includes('addon') || subPlan.includes('add_on')) {
//               return s;
//             }
//           });

//           return subs;
//         })
//         .flat();

//       customerAddons.forEach((sc) => {
//         const subscription = sc;
//         const planId = subscription?.plan?.id || '';
//         const values = {
//           planId,
//           balanceChangeFromActivity: activity,
//           subscription,
//           planIds,
//           customerId: sc.customer,
//         };
//         getGroupTotal(values, ['addon', 'add_on'], 'addon');
//       });

//       const planTotals = Object.keys(planIds).reduce((x, y: any) => {
//         return x + planIds[y].total;
//       }, 0);

//       const planCount = Object.keys(planIds).reduce((x, y: any) => {
//         return x + planIds[y].count;
//       }, 0);

//       console.log('planIds', planIds);

//       console.log(`
//         balanceChangeFromActivity count: ${balanceChangeFromActivity.length}
//         balanceChangeFromActivityNetTotal: ${balanceChangeFromActivityNetTotal}

//         customers: ${customers.length}
//         customerSubs: ${customerSubs.length}
//         customerAddons: ${customerAddons.length}

//         activityNetTotal: ${activityNetTotal}
//         activityNetTotal count: ${activity.length}

//         planTotals: ${planTotals}
//         planCount: ${planCount}

//         activityNetTotal - planTotals: ${parseInt(activityNetTotal) - parseInt(`${planTotals}`)}
//       `);
//     });

//     it.skip('balance_change_from_activity customers', async () => {
//       const start = new Date(2022, 10, 1, 0, 0, 0, 0);
//       const end = new Date(2022, 11, 5, 23, 59, 59, 59);

//       const balanceChangeFromActivity = await Client.getBalanceChangeFromActivity(start, end);
//       const balanceChangeFromActivityNetTotal = getTotalValue(balanceChangeFromActivity, 'net', false);
//       writeCsv(balanceChangeFromActivity, 'balanceChangeFromActivity.csv');

//       const customerIds = balanceChangeFromActivity.map((x) => x.customer_id).filter((x) => x);
//       const uniqueCustomerIds: string[] = Array.from(new Set(customerIds));

//       const customers: any[] = await Client.getCustomersByIds(uniqueCustomerIds);

//       const planIds: any = {};

//       const customerSubs = customers.map((c) => {
//         const subs = c.subscriptions.data.filter((s) => {
//           const subPlan = s?.plan?.id || 'unknown';
//           if (!subPlan.includes('addon') && !subPlan.includes('add_on')) {
//             return s;
//           }
//         });

//         return {
//           ...c,
//           subscriptions: {
//             data: subs,
//           },
//         };
//       });

//       console.log('customerSubs', customerSubs.length);

//       customerSubs.forEach((sc) => {
//         const subscription = sc.subscriptions.data[0];
//         const planId = subscription?.plan?.id || 'unknown';
//         const values = {
//           planId,
//           balanceChangeFromActivity,
//           subscription,
//           customer: sc,
//           planIds,
//           customerId: sc.id,
//         };

//         const allinKeys = ['_allin', '_all_in'];
//         getGroupTotal(values, allinKeys, 'allin', ['local']);

//         const localKeys = ['_local_', 'all_in_local', 'allinlocal'];
//         getGroupTotal(values, localKeys, 'local');

//         const travelerKeys = ['weekender', 'traveler'];
//         getGroupTotal(values, travelerKeys, 'traveler');

//         getGroupTotal(values, ['explorer'], 'explorer');
//         getGroupTotal(values, ['social'], 'social');
//         getGroupTotal(values, ['unknown'], 'unknown');
//         getGroupTotal(values, ['price_1I0C2CGuI3uPg2Uzq39he0fe'], 'price_1I0C2CGuI3uPg2Uzq39he0fe');
//         getGroupTotal(values, ['plan_gh_investor'], 'plan_gh_investor');
//         getGroupTotal(values, ['plan_gh_employee'], 'plan_gh_employee');
//       });

//       const customerAddOns = customers.map((c) => {
//         const subs = c.subscriptions.data.filter((s) => {
//           const subPlan = s?.plan?.id || '';
//           if (subPlan.includes('addon') || subPlan.includes('add_on')) {
//             // console.log('?????', subPlan)
//             return s;
//           }
//         });

//         return {
//           ...c,
//           subscriptions: {
//             data: subs,
//           },
//         };
//       });

//       console.log('customerAddOns', customerAddOns.length);
//       customerAddOns.forEach((ca) => {
//         const subscription = ca.subscriptions.data[0];
//         const planId = subscription?.plan?.id || 'unknown';
//         const values = {
//           planId,
//           balanceChangeFromActivity,
//           subscription,
//           customer: ca,
//           planIds,
//           customerId: ca.id,
//         };
//         getGroupTotal(values, ['addon', 'add_on'], 'addon');
//       });

//       // customerSubs.forEach(sc => {
//       //   const subPlan = sc?.plan?.id || 'unknown';

//       // if (stripeSubs.length === 0) {
//       //   /// find canceled sub
//       //   // did this happen after the last day of the month
//       //   console.log('no sub');
//       // }

//       // if (stripeSubs.length > 1) {
//       //   // log something
//       //   console.log('too many stripeSubs customer id:', customer.id, customer.subscriptions.data.map(s => s?.plan?.id ));
//       //   // console.log('????', JSON.stringify(subs));
//       // }

//       // if (stripeSubs.length === 1) {
//       //   console.log('good')
//       // }

//       // })

//       // customers.forEach((customer) => {

//       //   const stripeSubs = customer.subscriptions.data.filter((s) => {
//       //     const subPlan = s?.plan?.id || 'unknown';
//       //     console.log('!!!!!!!!!!!!', subPlan)
//       //     // priceId.includes('add_on') || priceId.includes('addon')
//       //     if (!subPlan.includes('addon') || !subPlan.includes('add_on')) {
//       //       return s;
//       //     }
//       //   });

//       //   console.log('DONE WITH stripeSubs')

//       // if (stripeSubs.length === 0) {
//       //   /// find canceled sub
//       //   // did this happen after the last day of the month
//       //   console.log('no sub');
//       // }

//       // if (stripeSubs.length > 1) {
//       //   // log something
//       //   console.log('too many stripeSubs customer id:', customer.id, customer.subscriptions.data.map(s => s?.plan?.id ));
//       //   // console.log('????', JSON.stringify(subs));
//       // }

//       // if (stripeSubs.length === 1) {
//       //   console.log('good')
//       // }

//       //   // if (subs.length === 1) {
//       //   const subscription = subs[0];
//       //   const planId = subscription?.plan?.id || 'unknown';
//       //   const values = {
//       //     planId,
//       //     balanceChangeFromActivity,
//       //     subscription,
//       //     customer,
//       //     planIds,
//       //     customerId: customer.id,
//       //   };

//       //   const allinKeys = ['_allin', '_all_in'];
//       //   getGroupTotal(values, allinKeys, 'allin', ['local']);

//       //   const localKeys = ['_local_', 'all_in_local', 'allinlocal'];
//       //   getGroupTotal(values, localKeys, 'local');

//       //   const travelerKeys = ['weekender', 'traveler'];
//       //   getGroupTotal(values, travelerKeys, 'traveler');

//       //   getGroupTotal(values, ['explorer'], 'explorer');
//       //   getGroupTotal(values, ['social'], 'social');
//       //   getGroupTotal(values, ['unknown'], 'unknown');
//       //   getGroupTotal(values, ['price_1I0C2CGuI3uPg2Uzq39he0fe'], 'price_1I0C2CGuI3uPg2Uzq39he0fe');
//       //   getGroupTotal(values, ['plan_gh_investor'], 'plan_gh_investor');
//       //   getGroupTotal(values, ['plan_gh_employee'], 'plan_gh_employee');
//       //   // }

//       // const addons =  customer.subscriptions.data.filter(x => {
//       //   if (x?.price?.id.includes('addon') || x?.price?.id.includes('add_on')) {
//       //     return x
//       //   }
//       // })

//       // addons.forEach(add => {
//       //   const subscription = add;
//       //   const planId = subscription?.plan?.id || 'unknown';
//       //   const values = {
//       //     planId,
//       //     balanceChangeFromActivity,
//       //     subscription,
//       //     customer,
//       //     planIds,
//       //     customerId: customer.id,
//       //   };
//       //   getGroupTotal(values, ['addon', 'add_on'], 'addon');
//       // })

//       //   // const subscriptions = customer.subscriptions.data;

//       //   // const subscription = subscriptions[0];
//       //   // const planId = subscription?.plan?.id || 'unknown';
//       //   // if (planId) {
//       //   //   const values = {
//       //   //     planId,
//       //   //     balanceChangeFromActivity,
//       //   //     subscription,
//       //   //     customer,
//       //   //     planIds,
//       //   //     customerId: customer.id,
//       //   //   };

//       //   //   const allinKeys = ['_allin', '_all_in'];
//       //   //   getGroupTotal(values, allinKeys, 'allin', ['local']);

//       //   //   const localKeys = ['_local_', 'all_in_local', 'allinlocal'];
//       //   //   getGroupTotal(values, localKeys, 'local');

//       //   //   const travelerKeys = ['weekender', 'traveler'];
//       //   //   getGroupTotal(values, travelerKeys, 'traveler');

//       //   //   getGroupTotal(values, ['explorer'], 'explorer');
//       //   //   getGroupTotal(values, ['addon', 'add_on'], 'addon');
//       //   //   getGroupTotal(values, ['social'], 'social');
//       //   //   getGroupTotal(values, ['unknown'], 'unknown');
//       //   //   getGroupTotal(values, ['price_1I0C2CGuI3uPg2Uzq39he0fe'], 'price_1I0C2CGuI3uPg2Uzq39he0fe');
//       //   //   getGroupTotal(values, ['plan_gh_investor'], 'plan_gh_investor');
//       //   //   getGroupTotal(values, ['plan_gh_employee'], 'plan_gh_employee');
//       //   // }
//       // });

//       // const subs = customers
//       //   .map((x) => {
//       //     return x.subscriptions.data;
//       //   })
//       //   .flat();

//       const subs = customers;

//       const subKeys = subs.map((x) => {
//         return {
//           plan: x?.plan?.id,
//           key: x?.key,
//           customerId: x.customer,
//         };
//       });

//       writeCsv(subKeys, 'subKeys.csv');
//       const planTotals = Object.keys(planIds).reduce((x, y: any) => {
//         return x + planIds[y].total;
//       }, 0);

//       const planCount = Object.keys(planIds).reduce((x, y: any) => {
//         return x + planIds[y].count;
//       }, 0);

//       console.log('planIds', planIds);

//       console.log(`
//         charge count: ${balanceChangeFromActivity.length}
//         customers count: ${customers.length}
//         balanceChangeFromActivityNetTotal: ${balanceChangeFromActivityNetTotal}

//         planTotals: ${planTotals}
//         planCount: ${planCount}
//       `);
//     });

//     it.skip('balance_change_from_activity', async () => {
//       const start = new Date(2022, 10, 1, 0, 0, 0, 0);
//       const end = new Date(2022, 10, 30, 23, 59, 59, 59);

//       const balanceChangeFromActivity = await Client.getBalanceChangeFromActivity(start, end);
//       const balanceChangeFromActivityNetTotal = getTotalValue(balanceChangeFromActivity, 'net', false);
//       writeCsv(balanceChangeFromActivity, 'balanceChangeFromActivity.csv');
//       console.log('balanceChangeFromActivityNetTotal DONE');

//       const customerIds = balanceChangeFromActivity.map((x) => x.customer_id).filter((x) => x);
//       const uniqueCustomerIds: string[] = Array.from(new Set(customerIds));

//       const customers: any[] = await Client.getCustomersByIds(uniqueCustomerIds);
//       console.log('customers DONE');
//       const plans: string[] = [];

//       const planIds: any = {};
//       customers.forEach((customer) => {
//         const subscriptions = customer.subscriptions.data;
//         subscriptions.forEach((subscription) => {
//           if (
//             (subscription.status !== 'canceled' &&
//               subscription?.plan?.id &&
//               subscription?.plan?.id.includes('plan_gh')) ||
//             subscription?.plan?.id.includes('gh_plan')
//           ) {
//             const planId = subscription.plan.id;

//             plans.push(planId);

//             const values = {
//               planId,
//               balanceChangeFromActivity,
//               subscription,
//               planIds,
//             };

//             const allinKeys = ['_allin', '_all_in'];
//             getGroupTotal(values, allinKeys, 'allin', ['local']);

//             const localKeys = ['_local_', 'all_in_local', 'allinlocal'];
//             getGroupTotal(values, localKeys, 'local');

//             const travelerKeys = ['weekender', 'traveler'];
//             getGroupTotal(values, travelerKeys, 'traveler');

//             getGroupTotal(values, ['explorer'], 'explorer');
//             getGroupTotal(values, ['addon', 'add_on'], 'addon');

//             getGroupTotal(values, ['social'], 'social');

//             // price_1I0C2CGuI3uPg2Uzq39he0fe
//             // plan_gh_employee
//             // plan_gh_investor
//           }
//         });
//       });

//       console.log('customers.forEach DONE');

//       console.log('planIds', planIds);

//       // const thing: any[] = []
//       // Object.entries(planIds).forEach((values: any) => {
//       //   values[1].plans.forEach(x => {
//       //     thing.push({ name: values[0], plan: x })
//       //   })
//       // })

//       // writeCsv(thing, 'thing.csv');

//       const subs = customers
//         .map((x) => {
//           return x.subscriptions.data;
//         })
//         .flat();

//       // console.log(subs)

//       const subKeys = subs.map((x) => {
//         return {
//           plan: x?.plan?.id,
//           key: x?.key,
//         };
//       });

//       writeCsv(subKeys, 'subKeys.csv');

//       console.log(`
//         charge count: ${balanceChangeFromActivity.length}
//         customers count: ${customers.length}
//         balanceChangeFromActivityNetTotal: ${balanceChangeFromActivityNetTotal}
//       `);
//     });

//     it.skip('payoutReconciliation', async () => {
//       try {
//         const start = new Date(2022, 10, 1, 0, 0, 0, 0);
//         const end = new Date(2022, 10, 30, 23, 59, 59, 59);

//         const payoutReconciliation = await Client.getPayoutReconciliation(start, end);

//         const payoutChargesInPeriod = payoutReconciliation.filter((x) => {
//           const createdAt = new Date(x.created);
//           if (isDateBetweenPeriod(createdAt, start, end)) {
//             return x;
//           }
//         });

//         console.log('payoutChargesInPeriod', payoutChargesInPeriod.length);

//         writeCsv(payoutChargesInPeriod, 'payoutChargesInPeriod.csv');

//         const uniqueCustomerIds = Array.from(new Set(payoutChargesInPeriod.map((x) => x.customer_id)));
//         console.log('uniqueCustomerIds.length', uniqueCustomerIds.length);

//         //////////
//         const startTimestampInSeconds = Math.floor(new Date(Date.UTC(2022, 9, 31, 23, 59, 59, 59)).getTime() / 1000);
//         const endTimestampInSeconds = Math.floor(new Date(Date.UTC(2022, 10, 30, 23, 59, 59, 59)).getTime() / 1000);

//         const query = `created>${startTimestampInSeconds} AND created<${endTimestampInSeconds}`;
//         const chargesInPeriod = await Client.searchCharges(query);
//         console.log('chargesInPeriod count', chargesInPeriod.length);

//         // const chargesInPeriod = charges.filter(x => {
//         //   const createdAt = new Date(x.created)
//         //   if (isDateBetweenPeriod(createdAt, start, end) ) {
//         //     return x
//         //   }
//         // })
//         // console.log('chargesInPeriodt', chargesInPeriod.length)

//         writeCsv(chargesInPeriod, 'chargesInPeriod.csv');
//       } catch (error) {
//         console.log('error', error);
//       }
//     });

//     it.skip('works', async () => {
//       const startTimestampInSeconds = Math.floor(new Date(Date.UTC(2022, 9, 31, 23, 59, 59, 59)).getTime() / 1000);
//       const endTimestampInSeconds = Math.floor(new Date(Date.UTC(2022, 10, 30, 23, 59, 59, 59)).getTime() / 1000);

//       const payouts = await Client.listPayouts({
//         limit: 100,
//         status: 'paid',
//         created: {
//           gte: startTimestampInSeconds,
//           lte: endTimestampInSeconds,
//         },
//       });

//       // const payoutTotal = getTotal(payouts.data, 'amount');

//       const payoutBalanceTransactionIds = payouts.map((x) => x.balance_transaction);

//       const stripeBalanceTransactions = await Client.listBalanceTransactions({
//         limit: 100,
//         created: {
//           gte: startTimestampInSeconds,
//           lte: endTimestampInSeconds,
//         },
//       });

//       const payoutBalanceTransactions = stripeBalanceTransactions.filter((x) => {
//         if (payoutBalanceTransactionIds.includes(x.id)) {
//           return x;
//         }
//       });

//       // const payoutBalanceTransactionsTotal = getTotal(payoutBalanceTransactions, 'net');

//       const payoutBalanceTransactionsIds = stripeBalanceTransactions.map((x) => x.id);
//       // console.log('payoutBalanceTransactionsIds', payoutBalanceTransactionsIds.length)
//       // console.log('???', payoutBalanceTransactionsIds)

//       const chargeStartTimestampInSeconds = Math.floor(new Date(Date.UTC(2022, 9, 0, 23, 59, 59, 59)).getTime() / 1000);
//       const chargeEndTimestampInSeconds = Math.floor(new Date(Date.UTC(2022, 11, 20, 23, 59, 59, 59)).getTime() / 1000);

//       const query = `created>${chargeStartTimestampInSeconds} AND created<${chargeEndTimestampInSeconds}`;
//       const stripeCharges = await Client.searchCharges(query);

//       const balanceTransactionsCharges = stripeCharges.filter((x) => {
//         if (payoutBalanceTransactionsIds.includes(`${x.balance_transaction}`)) {
//           return x;
//         }
//       });

//       // const balanceTransactionsChargesTotal = getTotal(balanceTransactionsCharges, 'amount_captured');

//       // console.log(`
//       //   balanceTransactionsCharges count ${balanceTransactionsCharges.length}
//       //   balanceTransactionsChargesTotal: ${balanceTransactionsChargesTotal}

//       //   payoutBalanceTransactions count: ${payoutBalanceTransactions.length}
//       //   payoutBalanceTransactionsTotal: ${payoutBalanceTransactionsTotal}

//       //   payout count: ${payouts.data.length}
//       //   payoutTotal: ${payoutTotal}
//       // `);
//     });

//     it.skip('should search charges', async () => {
//       try {
//         // const startTimestampInSeconds = Math.floor(new Date(Date.UTC(2022, 9, 31, 23, 59, 59, 59)).getTime() / 1000);
//         // const endTimestampInSeconds = Math.floor(new Date(Date.UTC(2022, 10, 30, 23, 59, 59, 59)).getTime() / 1000);

//         const startTimestampInSeconds = 1667282400;
//         const endTimestampInSeconds = 1669877999;

//         const query = `created>${startTimestampInSeconds} AND created<${endTimestampInSeconds}`;
//         const charges = await Client.searchCharges(query);

//         const chargeSum = charges.reduce((accumulator, value) => {
//           if (!value.disputed) {
//             return accumulator + value.amount_captured;
//           } else {
//             return accumulator + 0;
//           }
//         }, 0);

//         const chargeAmount = (chargeSum / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });

//         const refundedQuery = `created>${startTimestampInSeconds} AND created<${endTimestampInSeconds} AND refunded:"true"`;
//         const refunded = await Client.searchCharges(refundedQuery);

//         const refundedSum = refunded.reduce((accumulator, value) => {
//           return accumulator + value.amount;
//         }, 0);

//         const refundedAmount = (refundedSum / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });

//         const invoices = await Client.searchInvoices(query);

//         const invoicesSum = invoices.reduce((accumulator, value) => {
//           return accumulator + value.amount_paid;
//         }, 0);

//         const invoicesAmountPaid = (invoicesSum / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });

//         const invoicesAmountDueSum = invoices.reduce((accumulator, value) => {
//           return accumulator + value.amount_due;
//         }, 0);

//         const invoicesAmountDue = (invoicesAmountDueSum / 100).toLocaleString('en-US', {
//           style: 'currency',
//           currency: 'USD',
//         });

//         const payouts = await Client.listPayouts({
//           limit: 100,
//           status: 'paid',
//           created: {
//             gte: startTimestampInSeconds,
//             lte: endTimestampInSeconds,
//           },
//         });

//         const payoutSum = payouts.data.reduce((accumulator, value) => {
//           return accumulator + value.amount;
//         }, 0);

//         const payoutAmount = (payoutSum / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });

//         ///////
//         const stripeTransaction = await Client.listBalanceTransactions({
//           limit: 100,
//           created: {
//             gte: startTimestampInSeconds,
//             lte: endTimestampInSeconds,
//           },
//         });

//         const typesOfTransactions = new Set(
//           stripeTransaction.map((x) => {
//             return x.type;
//           }),
//         );

//         Array.from(typesOfTransactions).forEach((x) => {
//           const totals = getTransactionAmountByType(stripeTransaction, x);
//           console.log(`
//             ${x}: amountTotal: ${totals.amountTotal}
//             ${x}: netTotal: ${totals.netTotal}
//             ${x}: feesTotal: ${totals.feesTotal}
//           `);
//         });

//         console.log('typesOfTransactions', typesOfTransactions);

//         const transactions = stripeTransaction.filter((x) => {
//           if (x.type !== 'payout' && x.type !== 'refund') {
//             return x;
//           }
//         });

//         const payoutTransactions = stripeTransaction.filter((x) => {
//           if (x.type === 'payout') {
//             return x;
//           }
//         });

//         const transactionPayoutSum = payoutTransactions.reduce((accumulator, value) => {
//           return accumulator + value.net;
//         }, 0);

//         const transactionPayoutNetAmount = (transactionPayoutSum / 100).toLocaleString('en-US', {
//           style: 'currency',
//           currency: 'USD',
//         });

//         const transactionFeeSum = transactions.reduce((accumulator, value) => {
//           return accumulator + value.fee;
//         }, 0);

//         const transactionFee = (transactionFeeSum / 100).toLocaleString('en-US', {
//           style: 'currency',
//           currency: 'USD',
//         });

//         const transactionNetSum = transactions.reduce((accumulator, value) => {
//           return accumulator + value.net;
//         }, 0);

//         const transactionNet = (transactionNetSum / 100).toLocaleString('en-US', {
//           style: 'currency',
//           currency: 'USD',
//         });

//         const transactionAmountSum = transactions.reduce((accumulator, value) => {
//           return accumulator + value.amount;
//         }, 0);

//         const transactionAmount = (transactionAmountSum / 100).toLocaleString('en-US', {
//           style: 'currency',
//           currency: 'USD',
//         });

//         console.log(`
//         start: ${new Date(startTimestampInSeconds * 1000)}
//         end: ${new Date(endTimestampInSeconds * 1000)}

//           transaction count: ${transactions.length}
//           transactionAmount: ${transactionAmount}
//           transactionNet: ${transactionNet}
//           transactionFee: ${transactionFee}

//           payoutTransactions: ${payoutTransactions.length}
//           transactionPayoutNetAmount: ${transactionPayoutNetAmount}

//           invoices count: ${invoices.length}
//           invoicesAmountPaid: ${invoicesAmountPaid}
//           invoicesAmountDue: ${invoicesAmountDue}

//           charges refund count: ${refunded.length}
//           charge refund Amount: ${refundedAmount}

//           charges count: ${charges.length}
//           chargeAmount: ${chargeAmount}

//           payouts count: ${payouts.data.length}
//           payoutAmount: ${payoutAmount}
//         `);
//       } catch (error) {
//         console.log(error);
//       }
//     });

//     describe('chart', () => {
//       const currencyUsd = (value: number) => {
//         return value.toLocaleString('en-US', {
//           style: 'currency',
//           currency: 'USD',
//         });
//       };

//       const capitalizeFirstLetter = (value: string): string => value.charAt(0).toUpperCase() + value.slice(1);

//       const createChartUrl = (planIds: any, dataKey: string, label?: string, type: string = 'bar') => {
//         const backgroundColor = [
//           '#000102',
//           '#2A9C09',
//           '#CE20BF',
//           '#004F19',
//           '#FFC300',
//           '#00124F',
//           '#900C3F',
//           '#581845',
//           '#332DE0',
//           '#2D90E0',
//           '#6C92B0',
//           '#635D13',
//           '#070702',
//         ];

//         const labels = Object.keys(planIds);
//         const values = labels.map((key) => planIds[key][dataKey]);

//         const data = {
//           labels: labels.map((l) => `${capitalizeFirstLetter(l)}: ${planIds[l][dataKey]}`),
//           datasets: [
//             {
//               label: label || dataKey,
//               data: values,
//               backgroundColor,
//             },
//           ],
//         };

//         const chart = {
//           type,
//           data,
//         };

//         const encodedChart = encodeURIComponent(JSON.stringify(chart));
//         const chartUrl = `https://quickchart.io/chart?c=${encodedChart}`;
//         return chartUrl;
//       };

//       it.only('wasd', async () => {
//         const planIds = {
//           // noSubs: { count: 4, total: 1129.95 },
//           // noCustomer: { count: 0, total: 145.72 },
//           traveler: { count: 336, total: 56151.41 },
//           local: { count: 529, total: 120293.66 },
//           social: { count: 12, total: 231.24 },
//           allin: { count: 339, total: 140286.25 },
//           explorer: { count: 105, total: 2815.65 },
//           investor: { count: 4, total: 0 },
//           employee: { count: 1, total: 0 },
//           // unknown: { count: 1, total: 155.45 },
//           addon: { count: 219, total: 16541.6 },
//         };

//         console.log(planIds);

//         const totalChartUrl = createChartUrl(planIds, 'total', 'Total Revenue');
//         console.log(totalChartUrl);

//         const countChartUrl = createChartUrl(planIds, 'count', 'Account Membership Types', 'pie');
//         console.log(countChartUrl);
//       });
//     });
//   });
// });
