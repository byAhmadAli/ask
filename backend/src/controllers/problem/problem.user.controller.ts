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
  ProblemTypeRepository,
  RoleRepository
} from '../../repositories';

import {
  secured,
  SecuredType,
  TokenServiceBindings
} from '../../services';

const ObjectId = require('mongodb').ObjectId;

const ioc = require('socket.io-client');

const client = ioc('http://localhost:5002', {
  path: '/notification'
});

export class ProblemUserController {
  constructor(
    @repository(UsersRepository)
    private usersRepository: UsersRepository,
    @repository(RoleRepository)
    private roleRepository: RoleRepository,
    @repository(ProblemRepository)
    private problemRepository: ProblemRepository,
    @repository(ProblemTypeRepository)
    private problemTypeRepository: ProblemTypeRepository,

    @inject(TokenServiceBindings.CURRENT_USER, { optional: true })
    private currentUser: any,
  ) { }

  @post('/problems/create')
  @secured(SecuredType.HAS_ANY_ROLE, ['ADMIN', 'USER'])
  async createProblem(
    @requestBody({
      content: { 'application/json': { schema: { 'x-ts-type': IProblemModel } } },
    }) problem: Problem
  ) {
    const findUser = await this.usersRepository.findOne({ where: { email: this.currentUser.id } });
    if (!findUser) throw new HttpErrors.NotFound('User does not exist');

    const helperRole = await this.roleRepository.findOne({ where: { type: 'HELPER' } });
    if (!helperRole) throw new HttpErrors.NotFound('role does not exist');
    
    let findProblemType;
    if(problem.type === 'other'){
      findProblemType = await this.problemTypeRepository.findOne({ where: { type: 'غير ذلك' } })
    }else{
      findProblemType = await this.problemTypeRepository.findOne({ where: { _id: problem.type } })
    }

    if (!findProblemType) throw new HttpErrors.UnprocessableEntity('Problem type does not exist');
    
    try {

      problem._id = new ObjectId();
      problem.userId = findUser._id;
      problem.type = findProblemType.type;

      const savedProblem = await this.problemRepository.create(problem);
      
      client.emit("new_notification", savedProblem, [findUser._id, helperRole._id]);
      
      return {
        problem_id: savedProblem._id
      }
    } catch (error) {
      throw error;
    }
  }

  @patch('/problems/{id}/resolved')
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