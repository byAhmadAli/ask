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
  TokenServiceBindings,
  UserServiceBindings,
  Credentials
} from '../../services';
import { UserService } from '@loopback/authentication';
import { Users } from '../../models';

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

    @inject(UserServiceBindings.USER_SERVICE)
    public userService: UserService<Users, Credentials>,

    @inject(TokenServiceBindings.CURRENT_USER, { optional: true })
    private currentUser: any,
  ) { }
  
  @get('/problems')
  @secured(SecuredType.IS_AUTHENTICATED)
  async getMyProblem(
    @param.query.string('status')
    status: string
  ) {
    
    const findUser = await this.usersRepository.findOne({ where: { email: this.currentUser.id } });
    if (!findUser) throw new HttpErrors.NotFound('User does not exist');

    const roles = await this.userRoleRepository.find({ where: { userId: findUser._id } });
    const getUserRole = roles.map((r: any) => r.userType);

    let problems:any = [];
    if(getUserRole.includes('USER')){
      problems = await this.problemRepository.find({ where: { userId: findUser._id, status, deleted: false } });
    } else if(getUserRole.includes('HELPER')){
      problems = await this.problemRepository.find({ where: { status, deleted: false } });
    } else if(getUserRole.includes('ADMIN')){
      problems = await this.problemRepository.find({ where: { status, deleted: false } });
    }

    return problems.sort((a: any, b: any) => b.createdAt - a.createdAt);
  }
  
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
    
    if(getUserRole.includes('ADMIN')){
      const creator = await this.usersRepository.findOne({ where: { _id: problem.userId } });
      if (!creator) throw new HttpErrors.NotFound('User does not exist');
      const creatorProfile = await this.userService.convertToUserProfile(creator);

      const helper = await this.usersRepository.findOne({ where: { _id: problem.helperId } });
      if (!helper) throw new HttpErrors.NotFound('User does not exist');
      const helperProfile = await this.userService.convertToUserProfile(helper);

      return {problem, creatorProfile, helperProfile};
    }

    return problem;
  }

  @get('/problem/types')
  async getAllProblemTypes(
  ) {
    const problemTypes = await this.problemTypeRepository.find();
    return problemTypes;
  }
}