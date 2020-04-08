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
  AnswerRepository
} from '../repositories';

import {
  secured,
  SecuredType,
  TokenServiceBindings
} from '../services';

import {
  Answer,
  IِAnswerModel
} from '../models';

const ObjectId = require('mongodb').ObjectId;

export class AnswerController {
  constructor(
    @repository(UsersRepository)
    private usersRepository: UsersRepository,
    @repository(UserRoleRepository)
    private userRoleRepository: UserRoleRepository,
    @repository(ProblemRepository)
    private problemRepository: ProblemRepository,
    @repository(AnswerRepository)
    private answerRepository: AnswerRepository,

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

    const problem = await this.problemRepository.findOne({ where: { _id: id } });
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

    const problem = await this.problemRepository.findOne({ where: { _id: id } });
    if (!problem) throw new HttpErrors.NotFound('problem does not exist');

    if (problem.assigned && getUserRole.includes('USER') && problem.userId != findUser._id) {
      throw new HttpErrors.Unauthorized('You are not authorized!');
    } else if (problem.assigned && getUserRole.includes('HELPER') && problem.helperId != findUser._id) {
      throw new HttpErrors.Unauthorized('You are not authorized!');
    }

    const getAnswers = await this.answerRepository.find({ where: { problemId: id } });
    let formated = getAnswers.map(item => {
      let owner = (problem.userId === findUser._id);
      let me = (item.userId === findUser._id);
      let who;
      if (owner && me) {
        who = 'أنا';
      } else if (owner && !me) {
        who = 'مُساعد';
      } else if (!owner && me) {
        who = 'أنا';
      } else if (!owner && !me) {
        who = 'مُستخدم';
      }
      return {
        feeling: item.feeling,
        description: item.description,
        owner,
        who
      }
    });

    return formated;
  }
}