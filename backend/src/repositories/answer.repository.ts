import { DefaultCrudRepository } from '@loopback/repository';
import { Answer } from '../models';
import { MongoDsDataSource } from '../datasources';
import { inject } from '@loopback/core';

export class AnswerRepository extends DefaultCrudRepository<
  Answer,
  typeof Answer.prototype._id
  > {
  constructor(
    @inject('datasources.mongoDS') dataSource: MongoDsDataSource,
  ) {
    super(Answer, dataSource);
  }
}
