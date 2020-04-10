import { Entity, model, property, belongsTo } from '@loopback/repository';
import { Users } from '.';

@model({ settings: { strictObjectIDCoercion: true } })
export class Problem extends Entity {
  @property({
    type: 'string',
    id: true,
  })
  _id?: string;

  @belongsTo(() => Users, { keyTo: '_id' })
  userId: string;

  @belongsTo(() => Users, { keyTo: '_id' })
  helperId?: string;

  @property({
    type: 'string',
    required: true,
  })
  type: string;

  @property({
    type: 'string',
    required: true,
  })
  description: string;

  @property({
    type: 'string',
    required: true,
  })
  feeling: string;

  @property({
    type: 'boolean',
    required: false,
    default: false
  })
  deleted: boolean;

  @property({
    type: 'boolean',
    required: false,
    default: false
  })
  assigned?: boolean;

  @property({
    type: 'string',
    required: false,
    default: "OPEN"
  })
  status?: string;

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

  constructor(data?: Partial<Problem>) {
    super(data);
  }
}

export interface ProblemRelations {
  // describe navigational properties here
}

export type ProblemWithRelations = Users & ProblemRelations;

@model()
export class IProblemModel {
  @property()
  feeling: string;
  @property()
  description: string;
  @property()
  type: string;
}