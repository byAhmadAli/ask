import { DefaultCrudRepository } from '@loopback/repository';
import { Role } from '../models';
import { MongoDsDataSource } from '../datasources';
import { inject } from '@loopback/core';

export class RoleRepository extends DefaultCrudRepository<
  Role,
  typeof Role.prototype._id
  > {
  constructor(
    @inject('datasources.mongoDS') dataSource: MongoDsDataSource,
  ) {
    super(Role, dataSource);
  }
}
