import { repository } from '@loopback/repository';
import { inject } from '@loopback/core';
import { HttpErrors } from '@loopback/rest';
import {
  requestBody,
  post,
  get,
  patch,
  param
} from '@loopback/openapi-v3';

import {
  Problem,
  IProblemModel
} from '../../models';

import {
  UsersRepository,
  ProblemRepository,
  ProblemTypeRepository
} from '../../repositories';

import {
  secured,
  SecuredType,
  TokenServiceBindings
} from '../../services';

const ObjectId = require('mongodb').ObjectId;

export class ProblemUserController {
  constructor(
    @repository(UsersRepository)
    private usersRepository: UsersRepository,
    @repository(ProblemRepository)
    private problemRepository: ProblemRepository,
    @repository(ProblemTypeRepository)
    private problemTypeRepository: ProblemTypeRepository,

    @inject(TokenServiceBindings.CURRENT_USER, { optional: true })
    private currentUser: any,
  ) { }

  @post('/create/problem')
  @secured(SecuredType.HAS_ANY_ROLE, ['ADMIN', 'USER'])
  async createProblem(
    @requestBody({
      content: { 'application/json': { schema: { 'x-ts-type': IProblemModel } } },
    }) problem: Problem
  ) {
    const findUser = await this.usersRepository.findOne({ where: { email: this.currentUser.id } });
    if (!findUser) throw new HttpErrors.NotFound('User does not exist');
    const findProblemType = await this.problemTypeRepository.findOne({ where: { _id: problem.type } })
    if (!findProblemType) throw new HttpErrors.UnprocessableEntity('Problem type does not exist');
    try {

      problem._id = new ObjectId();
      problem.userId = findUser._id;
      problem.type = findProblemType.type;

      const savedProblem = await this.problemRepository.create(problem);

      return {
        problem_id: savedProblem._id
      }
    } catch (error) {
      throw error;
    }
  }

  @get('/problems/me')
  @secured(SecuredType.HAS_ANY_ROLE, ['ADMIN', 'USER'])
  async getMyProblem(
  ) {
    const findUser = await this.usersRepository.findOne({ where: { email: this.currentUser.id } });
    if (!findUser) throw new HttpErrors.NotFound('User does not exist');

    const problems = await this.problemRepository.find({ where: { userId: findUser._id, deleted: false } });

    return problems
  }

  @patch('/problem/{id}/resolved')
  @secured(SecuredType.HAS_ANY_ROLE, ['ADMIN', 'USER'])
  async resolvedProblem(
    @param.path.string('id') id: string,
  ) {
    const findUser = await this.usersRepository.findOne({ where: { email: this.currentUser.id } });
    if (!findUser) throw new HttpErrors.NotFound('User does not exist');

    const problem = await this.problemRepository.findOne({ where: { _id: id, deleted: false } });
    if (!problem) throw new HttpErrors.NotFound('problem does not exist');
    if (problem.userId != findUser._id) throw new HttpErrors.Unauthorized('You are not authorized!');

    try {

      await this.problemRepository.updateById(problem._id, {
        status: "RESOLVED",
        assigned: true
      });

      return "Problem resolved";
    } catch (error) {
      throw error;
    }
  }

}