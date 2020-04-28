import { repository } from '@loopback/repository';
import { inject } from '@loopback/core';
import { HttpErrors } from '@loopback/rest';
import {
  get,
  patch,
  requestBody
} from '@loopback/openapi-v3';

import {
  UsersRepository,
  UserSettingsRepository
} from '../repositories';

import {
  secured,
  SecuredType,
  TokenServiceBindings
} from '../services';

import {
  UserSettings,
  IِUserSettingsModel
} from '../models';

export class UserSettingsController {
  constructor(
    @repository(UsersRepository)
    private usersRepository: UsersRepository,
    @repository(UserSettingsRepository)
    private userSettingsRepository: UserSettingsRepository,

    @inject(TokenServiceBindings.CURRENT_USER, { optional: true })
    private currentUser: any,
  ) { }

  @get('/users/settings')
  @secured(SecuredType.IS_AUTHENTICATED)
  async getUserSettings(
  ) {
    const findUser = await this.usersRepository.findOne({ where: { email: this.currentUser.id } });
    if (!findUser) throw new HttpErrors.NotFound('User does not exist');

    const settings = await this.userSettingsRepository.findOne({where: {userId: findUser._id}});

    return settings;
  }

  @patch('/users/settings')
  @secured(SecuredType.IS_AUTHENTICATED)
  async updateUserSettings(
    @requestBody({
        content: { 'application/json': { schema: { 'x-ts-type': IِUserSettingsModel } } },
    }) setting: UserSettings
  ) {
    const findUser = await this.usersRepository.findOne({ where: { email: this.currentUser.id } });
    if (!findUser) throw new HttpErrors.NotFound('User does not exist');

    const findSettings = await this.userSettingsRepository.findOne({where: {userId: findUser._id}});
    if(!findSettings) throw new HttpErrors.NotFound('Setting does not exist');

    await this.userSettingsRepository.updateById(findSettings._id, setting);
    
    return 'updated';
  }
}