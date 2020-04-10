import {
  Entity,
  model,
  property
} from '@loopback/repository';

@model({ settings: { strictObjectIDCoercion: true } })
export class Users extends Entity {
  @property({
    type: 'string',
    id: true,
    required: false,
  })
  _id: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true
  })
  nickname: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'boolean',
    required: false,
    default: false
  })
  emailVerified: boolean;

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

  constructor(data?: Partial<Users>) {
    super(data);
  }
}

@model()
export class IUserModel {
  @property()
  email: string;
  @property()
  password: string;
  @property()
  nickname: string;
}

@model()
export class IUserCredentials {
  @property()
  email: string;
  @property()
  password: string;
}

@model()
export class IUserReset {
  @property()
  email: string;
}