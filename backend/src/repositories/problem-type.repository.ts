import { DefaultCrudRepository } from '@loopback/repository';
import { ProblemType } from '../models';
import { MongoDsDataSource } from '../datasources';
import { inject } from '@loopback/core';

export class ProblemTypeRepository extends DefaultCrudRepository<
  ProblemType,
  typeof ProblemType.prototype._id
  > {
  constructor(
    @inject('datasources.mongoDS') dataSource: MongoDsDataSource,
  ) {
    super(ProblemType, dataSource);
  }
}
