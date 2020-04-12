import { repository } from '@loopback/repository';
import { inject } from '@loopback/core';
import { HttpErrors } from '@loopback/rest';
import {
  get,
  patch,
  param
} from '@loopback/openapi-v3';

import {
  UsersRepository,
  ProblemRepository
} from '../../repositories';

import {
  secured,
  SecuredType,
  TokenServiceBindings
} from '../../services';

export class ProblemHelperController {
  constructor(
    @repository(UsersRepository)
    private usersRepository: UsersRepository,
    @repository(ProblemRepository)
    private problemRepository: ProblemRepository,

    @inject(TokenServiceBindings.CURRENT_USER, { optional: true })
    private currentUser: any,
  ) { }

  @get('/problems/assigned')
  @secured(SecuredType.HAS_ANY_ROLE, ['ADMIN', 'HELPER'])
  async getMyAssigned(
    @param.query.string('status')
    status: string
  ) {
    const findUser = await this.usersRepository.findOne({ where: { email: this.currentUser.id } });
    if (!findUser) throw new HttpErrors.NotFound('User does not exist');

    const problems = await this.problemRepository.find({ where: { assigned: true, status, helperId: findUser._id, deleted: false } });

    return problems.sort((a: any, b: any) => b.createdAt - a.createdAt);
  }

  @patch('/problems/{id}/assign')
  @secured(SecuredType.HAS_ANY_ROLE, ['ADMIN', 'HELPER'])
  async assignProblem(
    @param.path.string('id') id: string,
  ) {
    const findUser = await this.usersRepository.findOne({ where: { email: this.currentUser.id } });
    if (!findUser) throw new HttpErrors.NotFound('User does not exist');

    const problem = await this.problemRepository.findOne({ where: { _id: id, deleted: false } });
    if (!problem) throw new HttpErrors.NotFound('problem does not exist');

    try {

      await this.problemRepository.updateById(problem._id, {
        helperId: findUser._id,
        status: "ACTIVE",
        assigned: true
      });

      return "Problem active";
    } catch (error) {
      throw error;
    }
  }

}