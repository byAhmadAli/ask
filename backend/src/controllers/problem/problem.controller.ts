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
  ProblemTypeRepository,
  AnswerRepository,
  UserSettingsRepository
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
    @repository(AnswerRepository)
    private answerRepository: AnswerRepository,
    @repository(UserSettingsRepository)
    private userSettingsRepository: UserSettingsRepository,

    @inject(UserServiceBindings.USER_SERVICE)
    public userService: UserService<Users, Credentials>,

    @inject(TokenServiceBindings.CURRENT_USER, { optional: true })
    private currentUser: any,
  ) { }
  
  @get('/problems')
  @secured(SecuredType.IS_AUTHENTICATED)
  async getMyProblem(
  ) {
    
    const findUser = await this.usersRepository.findOne({ where: { email: this.currentUser.id } });
    if (!findUser) throw new HttpErrors.NotFound('User does not exist');

    const roles = await this.userRoleRepository.find({ where: { userId: findUser._id } });
    const getUserRole = roles.map((r: any) => r.userType);

    let problems:any = [];
    if(getUserRole.includes('USER')){
      problems = await this.problemRepository.find({ where: { userId: findUser._id, deleted: false } });
    } else if(getUserRole.includes('HELPER')){
      problems = await this.problemRepository.find({ where: { deleted: false } });
    } else if(getUserRole.includes('ADMIN')){
      problems = await this.problemRepository.find();
    }

    let formated =  await problems.map(async (item: any) => {
      let unReadCount: any = [];
      if(getUserRole.includes('USER')){
        unReadCount = await this.answerRepository.find({ where: { problemId: item._id, deleted: false, unReadUser: true } });
      }else if(getUserRole.includes('HELPER')){
        unReadCount = await this.answerRepository.find({ where: { problemId: item._id, deleted: false, unReadHelper: true } });
      }

      let lastAnswer = await this.answerRepository.find({ where: { problemId: item._id, deleted: false } })

      return {
        lastAnswer: lastAnswer[lastAnswer.length - 1],
        unReadCount: unReadCount.length,
        ...item
      };
    })

    return Promise.all(formated).then((completed) => {
      return completed.sort((a: any, b: any) => b.updatedAt - a.updatedAt);
    });
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
    
    const user = await this.usersRepository.findOne({ where: { _id: problem.userId } });
    if (!user) throw new HttpErrors.NotFound('User does not exist');
    const settings = await this.userSettingsRepository.findOne({where: {userId: problem.userId}});
    if(!settings) throw new HttpErrors.NotFound('Settings does not exist');

    let getProfile;
    if(settings.showNickName){
      let profile = await this.userService.convertToUserProfile(user);
      getProfile ={
        name: profile.name,
        me: findUser._id === problem.userId
      }
    }else{
      getProfile ={
        name: 'مجهول',
        me: findUser._id === problem.userId
      }
    }

    return {
      profile: getProfile,
      ...problem
    };
  }

  @get('/problem/types')
  async getAllProblemTypes(
  ) {
    const problemTypes = await this.problemTypeRepository.find();
    return problemTypes;
  }
}