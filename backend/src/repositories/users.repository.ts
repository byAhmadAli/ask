import { DefaultCrudRepository } from '@loopback/repository';
import { Users } from '../models';
import { MongoDsDataSource } from '../datasources';
import { inject } from '@loopback/core';

export class UsersRepository extends DefaultCrudRepository<
  Users,
  typeof Users.prototype._id
  > {
  constructor(
    @inject('datasources.mongoDS') dataSource: MongoDsDataSource,
  ) {
    super(Users, dataSource);
  }
}
