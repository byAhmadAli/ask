import { DefaultCrudRepository } from '@loopback/repository';
import { UserRole } from '../models';
import { MongoDsDataSource } from '../datasources';
import { inject } from '@loopback/core';

export class UserRoleRepository extends DefaultCrudRepository<
  UserRole,
  typeof UserRole.prototype._id
  > {
  constructor(
    @inject('datasources.mongoDS') dataSource: MongoDsDataSource,
  ) {
    super(UserRole, dataSource);
  }
}
