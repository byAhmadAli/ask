import { DefaultCrudRepository } from '@loopback/repository';
import { UserSettings } from '../models';
import { MongoDsDataSource } from '../datasources';
import { inject } from '@loopback/core';

export class UserSettingsRepository extends DefaultCrudRepository<
  UserSettings,
  typeof UserSettings.prototype._id
  > {
  constructor(
    @inject('datasources.mongoDS') dataSource: MongoDsDataSource,
  ) {
    super(UserSettings, dataSource);
  }
}
