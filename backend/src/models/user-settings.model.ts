import { Entity, model, property, belongsTo } from '@loopback/repository';
import { Users } from '.';

@model({ settings: { strictObjectIDCoercion: true } })
export class UserSettings extends Entity {
  @property({
    type: 'string',
    id: true,
  })
  _id?: string;

  @belongsTo(() => Users, { keyTo: '_id' })
  userId: string;

  @property({
    type: 'boolean',
    required: false,
    default: false
  })
  showNickName: boolean;

  @property({
    type: 'boolean',
    required: false,
    default: false
  })
  enableNotifications: boolean;

  @property({
    type: 'boolean',
    required: false,
    default: false
  })
  enableSounds: boolean;

  @property({
    type: 'boolean',
    required: false,
    default: false
  })
  darkMode: boolean;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  createdAt?: Date;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  updatedAt?: Date;

  constructor(data?: Partial<UserSettings>) {
    super(data);
  }
}

export interface UserSettingsRelations {
  // describe navigational properties here
}

export type UserSettingsWithRelations = Users & UserSettingsRelations;

@model()
export class IِUserSettingsModel {
  @property()
  showNickName?: boolean;
  @property()
  enableNotifications?: boolean;
  @property()
  enableSounds?: boolean;
  @property()
  darkMode?: boolean;
}
