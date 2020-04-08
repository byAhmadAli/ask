import { Entity, model, property, belongsTo } from '@loopback/repository';
import { Users } from './user.model';
import { Role } from './role.model';

@model({ settings: { strictObjectIDCoercion: true } })
export class UserRole extends Entity {
  @property({
    type: 'string',
    id: true
  })
  _id?: string;

  @property({
    type: 'string',
    required: true,
  })
  userType: string

  @belongsTo(() => Users, { keyTo: '_id' })
  userId: string;

  @belongsTo(() => Role)
  roleId: string;

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

  constructor(data?: Partial<UserRole>) {
    super(data);
  }
}

export interface UserRoleRelations {
  // describe navigational properties here
}

export type UserRoleWithRelations = Users & UserRoleRelations;
