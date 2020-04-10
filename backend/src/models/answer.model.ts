import { Entity, model, property, belongsTo } from '@loopback/repository';
import { Users, Problem } from '.';

@model({ settings: { strictObjectIDCoercion: true } })
export class Answer extends Entity {
  @property({
    type: 'string',
    id: true,
  })
  _id?: string;

  @belongsTo(() => Problem, { keyTo: '_id' })
  problemId: string;

  @belongsTo(() => Users, { keyTo: '_id' })
  userId: string;

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
    type: 'date',
    default: () => new Date(),
  })
  createdAt?: Date;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  updatedAt?: Date;

  constructor(data?: Partial<Answer>) {
    super(data);
  }
}

export interface AnswerRelations {
  // describe navigational properties here
}

export type AnswerWithRelations = Problem & Users & AnswerRelations;

@model()
export class IِAnswerModel {
  @property()
  feeling: string;
  @property()
  description: string;
}