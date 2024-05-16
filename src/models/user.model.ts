import { Optional } from 'sequelize';
import { BelongsTo, Column, DataType, HasOne, HasMany, Model, Table, AfterSave } from 'sequelize-typescript';

import Account from './account.model';
import Role from './role.model';
import Event from './event.model';
import Stripe from './stripe.model';
import EventProfile from './eventProfile.model';
import GymBooking from './gymBooking.model';
import EventBooking from './eventBooking.model';
import RentalBooking from './rentalBooking.model';
import HausReservations from './hausReservations.model';
import Participant from './participant.model';
import MembershipApplicationStatus from './membershipApplicationStatus.model';
import UserMembership from './userMembership.model';
import UserProfileData from './userProfileData.model';

import syncData, { AllowedModels } from '../utils/sync-data/sync-data';

export interface UserAttributes {
  id: number;
  email: string;
  password: string;
  roleId: number;
  uuid: string;
  lastActivityDate: Date;
  createdAt: Date | string;
  updatedAt: Date | string;

  account?: Account;
  role: Role;

  events?: Event[];
  stripe?: Stripe;
  eventProfile?: EventProfile;
  gymBookings?: GymBooking[];
  eventBookings?: EventBooking[];
  rentalBookings?: RentalBooking[];
  hausReservations?: HausReservations[];
  membershipApplicationStatus?: MembershipApplicationStatus;
  userMemberships?: UserMembership[];
  userProfileData?: UserProfileData;
}
interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

@Table({ tableName: 'User' })
export default class User extends Model<UserAttributes, UserCreationAttributes> {
  @AfterSave
  static async afterSaveHook(instance: User, options: any): Promise<void> {
    await syncData(AllowedModels.USER, instance, options);
  }

  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column(DataType.STRING)
  email: string;

  @Column(DataType.STRING)
  password: string;

  @Column(DataType.STRING)
  uuid: string;

  @Column(DataType.DATE)
  lastActivityDate: Date;

  @Column(DataType.DATE)
  createdAt: string;

  @Column(DataType.DATE)
  updatedAt: string;

  @Column(DataType.NUMBER)
  roleId: number;

  @BelongsTo(() => Role, 'roleId')
  role: Role;

  @HasOne(() => Account, 'userId')
  account: Account;

  @HasOne(() => Participant, 'userId')
  participant?: Participant;

  @HasOne(() => MembershipApplicationStatus, 'userId')
  membershipApplicationStatus?: MembershipApplicationStatus;

  @HasOne(() => Stripe, 'userId')
  stripe: Stripe;

  @HasOne(() => EventProfile, 'userId')
  eventProfile: EventProfile;

  @HasOne(() => UserProfileData, 'userId')
  userProfileData: UserProfileData;

  @HasMany(() => Event, 'ownerId')
  events: Event[];

  @HasMany(() => GymBooking, 'userId')
  gymBookings: GymBooking[];

  @HasMany(() => EventBooking, 'userId')
  eventBookings: EventBooking[];

  @HasMany(() => RentalBooking, 'userId')
  rentalBookings: RentalBooking[];

  @HasMany(() => HausReservations, 'user_id')
  hausReservations: HausReservations[];

  @HasMany(() => UserMembership, 'userId')
  userMemberships: UserMembership[];
}
