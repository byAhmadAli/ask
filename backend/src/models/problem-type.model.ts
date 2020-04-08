import { Entity, model, property } from '@loopback/repository';

@model({ settings: { strictObjectIDCoercion: true } })
export class ProblemType extends Entity {
  @property({
    type: 'string',
    id: true,
  })
  _id?: string;

  @property({
    type: 'string',
    required: true,
  })
  type: string;

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

  constructor(data?: Partial<ProblemType>) {
    super(data);
  }
}

@model()
export class IProblemTypeModel {
  @property()
  description: string;
  @property()
  type: string;
}