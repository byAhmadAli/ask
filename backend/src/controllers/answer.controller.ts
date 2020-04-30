import { repository } from '@loopback/repository';
import { inject } from '@loopback/core';
import { HttpErrors } from '@loopback/rest';
import {
  get,
  param,
  post,
  requestBody
} from '@loopback/openapi-v3';

import {
  UsersRepository,
  UserRoleRepository,
  ProblemRepository,
  AnswerRepository,
  RoleRepository,
  UserSettingsRepository
} from '../repositories';

import {
  secured,
  SecuredType,
  TokenServiceBindings,
  UserServiceBindings,
  Credentials
} from '../services';
import { UserService } from '@loopback/authentication';

import {
  Answer,
  IِAnswerModel,
  Users
} from '../models';

const ObjectId = require('mongodb').ObjectId;

const ioc = require('socket.io-client');

const client = ioc('https://fadfed.me/api/notification', {
  path: '/notification'
});


export class AnswerController {
  constructor(
    @repository(UsersRepository)
    private usersRepository: UsersRepository,
    @repository(RoleRepository)
    private roleRepository: RoleRepository,
    @repository(UserRoleRepository)
    private userRoleRepository: UserRoleRepository,
    @repository(ProblemRepository)
    private problemRepository: ProblemRepository,
    @repository(AnswerRepository)
    private answerRepository: AnswerRepository,
    @repository(UserSettingsRepository)
    private userSettingsRepository: UserSettingsRepository,

    @inject(UserServiceBindings.USER_SERVICE)
    public userService: UserService<Users, Credentials>,

    @inject(TokenServiceBindings.CURRENT_USER, { optional: true })
    private currentUser: any,
  ) { }

  @post('/problems/{id}/create/answer')
  @secured(SecuredType.IS_AUTHENTICATED)
  async createAnswer(
    @param.path.string('id') id: string,
    @requestBody({
      content: { 'application/json': { schema: { 'x-ts-type': IِAnswerModel } } },
    }) answer: Answer
  ) {
    const findUser = await this.usersRepository.findOne({ where: { email: this.currentUser.id } });
    if (!findUser) throw new HttpErrors.NotFound('User does not exist');

    const roles = await this.userRoleRepository.find({ where: { userId: findUser._id } });
    const getUserRole = roles.map((r: any) => r.userType);

    const problem = await this.problemRepository.findOne({ where: { _id: id, deleted: false } });
    if (!problem) throw new HttpErrors.NotFound('problem does not exist');

    if (problem.assigned && getUserRole.includes('USER') && problem.userId != findUser._id) {
      throw new HttpErrors.Unauthorized('You are not authorized!');
    } else if (problem.assigned && getUserRole.includes('HELPER') && problem.helperId != findUser._id) {
      throw new HttpErrors.Unauthorized('You are not authorized!');
    } else if (!problem.assigned && getUserRole.includes('HELPER')) {
      throw new HttpErrors.Unauthorized('You are not authorized!');
    }

    try {

      answer._id = new ObjectId();
      answer.userId = findUser._id;
      answer.problemId = id;

      const savedAnswer = await this.answerRepository.create(answer);
      const updatedAt = new Date();
      const unReadHelper = await this.answerRepository.find({where: {problemId: id, unReadHelper: true}});
      await this.problemRepository.updateById(id, {
        updatedAt: updatedAt
      });

      let sendToId;
      if(!problem.assigned && getUserRole.includes('USER')){
        const helperRole = await this.roleRepository.findOne({ where: { type: 'HELPER' } });
        if (!helperRole) throw new HttpErrors.NotFound('role does not exist');
        sendToId = helperRole._id;
      }else if(getUserRole.includes('USER')){
        sendToId = problem.helperId;
      }else if(getUserRole.includes('HELPER')){
        sendToId = problem.userId;
      }

      client.emit("new_notification", {
        _id: savedAnswer.problemId,
        unReadCount: unReadHelper.length,
        update: true
      }, sendToId);

      client.emit("new_notification", {
        _id: savedAnswer.problemId,
        updatedAt: updatedAt,
        lastAnswer: savedAnswer,
        update: true
      }, [sendToId, findUser._id]);

      return {
        answer_id: savedAnswer._id
      }
    } catch (error) {
      throw error;
    }
  }

  @get('/problems/{id}/answers')
  @secured(SecuredType.IS_AUTHENTICATED)
  async getAnswers(
    @param.path.string('id') id: string,
  ) {
    const findUser = await this.usersRepository.findOne({ where: { email: this.currentUser.id } });
    if (!findUser) throw new HttpErrors.NotFound('User does not exist');

    const roles = await this.userRoleRepository.find({ where: { userId: findUser._id } });
    const getUserRole = roles.map((r: any) => r.userType);

    const problem = await this.problemRepository.findOne({ where: { _id: id, deleted: false } });
    if (!problem) throw new HttpErrors.NotFound('problem does not exist');

    if (problem.assigned && getUserRole.includes('USER') && problem.userId != findUser._id) {
      throw new HttpErrors.Unauthorized('You are not authorized!');
    } else if (problem.assigned && getUserRole.includes('HELPER') && problem.helperId != findUser._id) {
      throw new HttpErrors.Unauthorized('You are not authorized!');
    }

    const getAnswers = await this.answerRepository.find({ where: { problemId: id, deleted: false } });
    let formated = await getAnswers.map(async (item: any) => {
      
      const user = await this.usersRepository.findOne({ where: { _id: item.userId } });
      if (!user) throw new HttpErrors.NotFound('User does not exist');
      const settings = await this.userSettingsRepository.findOne({where: {userId: item.userId}});
      if(!settings) throw new HttpErrors.NotFound('Settings does not exist');
     
      let getProfile;
      if(settings.showNickName){
        let profile = await this.userService.convertToUserProfile(user);
        getProfile ={
          name: profile.name,
          me: findUser._id === item.userId
        }
      }else{
        getProfile ={
          name: 'مجهول',
          me: findUser._id === item.userId
        }
      }
      
      return {
        profile: getProfile,
        ...item
      };
    });

    if (problem.assigned && getUserRole.includes('HELPER')){
      await this.answerRepository.updateAll({
        unReadHelper: false
      }, {
        problemId: id
      });
      
    }else if(getUserRole.includes('USER')){
      await this.answerRepository.updateAll({
        unReadUser: false
      }, {
        problemId: id
      });
    }
    
    if (problem.assigned){
      client.emit("new_notification", {
        _id: id,
        unReadCount: 0,
        update: true
      }, findUser._id);
    }
    
    return Promise.all(formated).then((completed) => {
      return completed;
    });
  }
}