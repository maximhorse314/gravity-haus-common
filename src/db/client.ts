import { Sequelize, SequelizeOptions } from 'sequelize-typescript';

import Account from '../models/account.model';
import ActivityLog from '../models/activityLog.model';
import Audit from '../models/audit.model';
import User from '../models/user.model';
import Role from '../models/role.model';
import Participant from '../models/participant.model';
import Phone from '../models/phone.model';
import MembershipApplication from '../models/membershipApplication.model';
import MembershipApplicationStatus from '../models/membershipApplicationStatus.model';
import Event from '../models/event.model';
import Stripe from '../models/stripe.model';
import EventProfile from '../models/eventProfile.model';
import GymBooking from '../models/gymBooking.model';
import EventBooking from '../models/eventBooking.model';
import RentalBooking from '../models/rentalBooking.model';
import HausReservations from '../models/hausReservations.model';
import Address from '../models/address.model';
import EventType from '../models/eventType.model';
import GymLocation from '../models/gymLocation.model';
import AwsSnsTopic from '../models/awsSnsTopic.model';
import SignUpCouponPromotion from '../models/signUpCouponPromotion.model';
import SignUpPhasePromotion from '../models/signUpPhasePromotion.model';
import StripePlanVersion from '../models/stripePlanVersion.model';
import StripePlan from '../models/stripePlan.model';
import Referral from '../models/referral.model';
import UserMembership from '../models/userMembership.model';
import Subscription from '../models/subscription.model';
import Product from '../models/product.model';
import OldMembershipInfo from '../models/oldMembershipInfo.model';
import EventWebhook from '../models/eventWebhook.model';
import UserProfileData from '../models/userProfileData.model';

/**
 * Singleton class that initializes database connection and adds models to Sequelize
 *
 * connect to a database doc: https://www.npmjs.com/package/sequelize-typescript#installation:~:text=sequelize%20docs)-,Configuration,you%20have%20to%20configure%20a%20Sequelize%20instance%20from%20sequelize%2Dtypescript(!).,-import%20%7B%20Sequelize
 */
export class Client {
  static instance: Client;
  db: Sequelize;

  private constructor(dbConfig: SequelizeOptions = {}) {
    const {
      MYSQL_DATABASE,
      MYSQL_HOST,
      MYSQL_PASSWORD,
      MYSQL_PORT,
      MYSQL_USER,
      MYSQL_POOL_ACQUIRE,
      MYSQL_POOL_IDLE,
      MYSQL_POOL_MAX,
      MYSQL_POOL_MIN,
    } = process.env;

    const defaultDbConfig = {
      database: `${MYSQL_DATABASE}`,
      username: `${MYSQL_USER}`,
      password: `${MYSQL_PASSWORD}`,
      host: `${MYSQL_HOST}`,
      dialect: 'mysql',
      port: parseInt(MYSQL_PORT || '', 10) || 3306,
      define: {
        timestamps: false,
      },
      // pool: {
      //   max: MYSQL_POOL_MAX || 15,
      //   min: MYSQL_POOL_MIN || 0,
      //   acquire: MYSQL_POOL_ACQUIRE || 10000,
      //   idle: MYSQL_POOL_IDLE || 10000,
      // },
    } as SequelizeOptions;

    const config = { ...defaultDbConfig, ...dbConfig };
    this.db = new Sequelize(config);
  }

  public static getInstance(models?: any, dbConfig: SequelizeOptions = {}): Client {
    if (!Client.instance) {
      Client.instance = new Client(dbConfig);

      Client.instance.db.addModels([
        Account,
        ActivityLog,
        Address,
        Audit,
        AwsSnsTopic,
        Event,
        EventBooking,
        EventProfile,
        EventType,
        GymBooking,
        GymLocation,
        HausReservations,
        MembershipApplication,
        MembershipApplicationStatus,
        Participant,
        Phone,
        Referral,
        RentalBooking,
        Role,
        Stripe,
        SignUpCouponPromotion,
        SignUpPhasePromotion,
        StripePlanVersion,
        StripePlan,
        User,
        UserProfileData,
        UserMembership,
        Subscription,
        Product,
        OldMembershipInfo,
        EventWebhook,
      ]);
    }
    if (models?.length) Client.instance.db.addModels(models);
    return Client.instance;
  }

  /**
   * closes the db connection and sets the instance to null
   */
  public static async close(): Promise<any> {
    await Client.instance?.db.close();
    // @ts-ignore
    Client.instance = null;
  }
}

export default Client;
