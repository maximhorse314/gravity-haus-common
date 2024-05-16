import { Optional } from 'sequelize';
import { Table, Model, Column, DataType, BelongsTo } from 'sequelize-typescript';

import User from './user.model';

export interface EventAttributes {
  id: number;
  ownerId: number;
  status: string;
  user: User;

  intensity: string; // enum('Low','Medium','High')
  description: string; // text
  name: string;

  pageUrl: string; // text
  primaryImageUrl: string; // text
  secondaryImageUrl: string; // text
  termsAndConditionsUrl: string; // text
  waiverUrl: string; // text

  locationName: string;
  getStreamActivityId: string;
  getStreamFeedUserId: string;
  mustBring: string;
  recommendedBring: string;
  allowedThings: string;
  cancellationReason: string;

  isPaidEvent: number;
  eventAddressId: number;
  cutOffTime: number;
  isGHEvent: number;
  notifyHostOnJoin: number;
  notifyHostOnCancel: number;
  createdById: number;
  updatedById: number;
  eventAttendanceType: number;
  eventSkillLevelId: number;
  eventParticipantTypeId: number;
  contactNumber: number;
  publishToFacebook: number;
  publishToFacebookStatus: number;
  agreedToTermsAndConditions: number;
  productId: number;
  promotional: number;
  leaderId: number;
  locationId: number;
  maxAge: number;
  maxCapacity: number;
  maxGuests: number;
  membersOnly: number;
  minAge: number;
  minCapacity: number;
  noCancelWithinHours: number;
  eventTypeId: number;
  hasWaitlist: number;

  startTime: Date;
  createdAt: Date;
  updatedAt: Date;
  endTime: Date;
}
interface EventCreationAttributes extends Optional<EventAttributes, 'id'> {}

@Table({ tableName: 'Event' })
export default class Event extends Model implements EventCreationAttributes {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({ type: DataType.INTEGER })
  ownerId: number;

  @Column(DataType.STRING)
  status: string;

  @BelongsTo(() => User, 'ownerId')
  user: User;

  @Column(DataType.STRING)
  intensity: string; // enum('Low','Medium','High')

  @Column(DataType.TEXT)
  description: string; // text

  @Column(DataType.STRING)
  name: string;

  @Column(DataType.TEXT)
  pageUrl: string; // text

  @Column(DataType.TEXT)
  primaryImageUrl: string; // text

  @Column(DataType.TEXT)
  secondaryImageUrl: string; // text

  @Column(DataType.TEXT)
  termsAndConditionsUrl: string; // text

  @Column(DataType.STRING)
  waiverUrl: string; // text

  @Column(DataType.STRING)
  locationName: string;

  @Column(DataType.STRING)
  getStreamActivityId: string;

  @Column(DataType.STRING)
  getStreamFeedUserId: string;

  @Column(DataType.STRING)
  mustBring: string;

  @Column(DataType.STRING)
  recommendedBring: string;

  @Column(DataType.STRING)
  allowedThings: string;

  @Column(DataType.STRING)
  cancellationReason: string;

  @Column(DataType.NUMBER)
  isPaidEvent: number;

  @Column(DataType.NUMBER)
  eventAddressId: number;

  @Column(DataType.NUMBER)
  cutOffTime: number;

  @Column(DataType.NUMBER)
  isGHEvent: number;

  @Column(DataType.NUMBER)
  notifyHostOnJoin: number;

  @Column(DataType.NUMBER)
  notifyHostOnCancel: number;

  @Column(DataType.NUMBER)
  createdById: number;

  @Column(DataType.NUMBER)
  updatedById: number;

  @Column(DataType.NUMBER)
  eventAttendanceType: number;

  @Column(DataType.NUMBER)
  eventSkillLevelId: number;

  @Column(DataType.NUMBER)
  eventParticipantTypeId: number;

  @Column(DataType.NUMBER)
  contactNumber: number;

  @Column(DataType.NUMBER)
  publishToFacebook: number;

  @Column(DataType.NUMBER)
  publishToFacebookStatus: number;

  @Column(DataType.NUMBER)
  agreedToTermsAndConditions: number;

  @Column(DataType.NUMBER)
  productId: number;

  @Column(DataType.NUMBER)
  promotional: number;

  @Column(DataType.NUMBER)
  leaderId: number;

  @Column(DataType.NUMBER)
  locationId: number;

  @Column(DataType.NUMBER)
  maxAge: number;

  @Column(DataType.NUMBER)
  maxCapacity: number;

  @Column(DataType.NUMBER)
  maxGuests: number;

  @Column(DataType.NUMBER)
  membersOnly: number;

  @Column(DataType.NUMBER)
  minAge: number;

  @Column(DataType.NUMBER)
  minCapacity: number;

  @Column(DataType.NUMBER)
  noCancelWithinHours: number;

  @Column(DataType.NUMBER)
  eventTypeId: number;

  @Column(DataType.NUMBER)
  hasWaitlist: number;

  @Column(DataType.DATE)
  startTime: Date;

  @Column(DataType.DATE)
  createdAt: Date;

  @Column(DataType.DATE)
  updatedAt: Date;

  @Column(DataType.DATE)
  endTime: Date;
}
