import { DefaultCrudRepository } from '@loopback/repository';
import { Problem } from '../models';
import { MongoDsDataSource } from '../datasources';
import { inject } from '@loopback/core';

export class ProblemRepository extends DefaultCrudRepository<
  Problem,
  typeof Problem.prototype._id
  > {
  constructor(
    @inject('datasources.mongoDS') dataSource: MongoDsDataSource,
  ) {
    super(Problem, dataSource);
  }
}
