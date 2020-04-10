import { repository } from '@loopback/repository';
import { inject } from '@loopback/core';
import { HttpErrors } from '@loopback/rest';
import {
  get,
  param
} from '@loopback/openapi-v3';

import {
  UsersRepository,
  UserRoleRepository,
  ProblemRepository,
  ProblemTypeRepository
} from '../../repositories';

import {
  secured,
  SecuredType,
  TokenServiceBindings
} from '../../services';

export class ProblemController {
  constructor(
    @repository(UsersRepository)
    private usersRepository: UsersRepository,
    @repository(UserRoleRepository)
    private userRoleRepository: UserRoleRepository,
    @repository(ProblemRepository)
    private problemRepository: ProblemRepository,
    @repository(ProblemTypeRepository)
    private problemTypeRepository: ProblemTypeRepository,

    @inject(TokenServiceBindings.CURRENT_USER, { optional: true })
    private currentUser: any,
  ) { }

  @get('/problems/{id}')
  @secured(SecuredType.IS_AUTHENTICATED)
  async getProblem(
    @param.path.string('id') id: string,
  ) {
    const findUser = await this.usersRepository.findOne({ where: { email: this.currentUser.id } });
    if (!findUser) throw new HttpErrors.NotFound('User does not exist');

    const roles = await this.userRoleRepository.find({ where: { userId: findUser._id } });
    const getUserRole = roles.map((r: any) => r.userType);

    const problem: any = await this.problemRepository.findOne({ where: { _id: id, deleted: false } });
    if (!problem) throw new HttpErrors.NotFound('problem does not exist');

    if (problem.assigned && getUserRole.includes('USER') && problem.userId != findUser._id) {
      throw new HttpErrors.Unauthorized('You are not authorized!');
    } else if (problem.assigned && getUserRole.includes('HELPER') && problem.helperId != findUser._id) {
      throw new HttpErrors.Unauthorized('You are not authorized!');
    }

    problem.user = (problem.userId === findUser._id);
    problem.helper = (problem.helperId === findUser._id);

    return problem
  }
  @get('/problem/types')
  async getAllProblemTypes(

  ) {
    const problemTypes = await this.problemTypeRepository.find();
    return problemTypes;
  }
}