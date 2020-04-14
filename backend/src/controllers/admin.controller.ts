import { repository } from '@loopback/repository';
import { inject } from '@loopback/core';
import { HttpErrors } from '@loopback/rest';
import {
  param,
  patch,
  get
} from '@loopback/openapi-v3';

import {
  UsersRepository,
  ProblemRepository,
  AnswerRepository
} from '../repositories';

import {
  UserServiceBindings,
  secured,
  SecuredType,
  Credentials
} from '../services';

import { UserService } from '@loopback/authentication';
import { Users } from '../models';

export class AdminController {
  constructor(
    @repository(UsersRepository)
    private usersRepository: UsersRepository,
    @repository(ProblemRepository)
    private problemRepository: ProblemRepository,
    @repository(AnswerRepository)
    private answerRepository: AnswerRepository,

    @inject(UserServiceBindings.USER_SERVICE)
    public userService: UserService<Users, Credentials>,
  ) { }

  @get('/admin/problems')
  @secured(SecuredType.HAS_ANY_ROLE, ['ADMIN'])
  async getAllProblems(
    
  ) {
    const problems = await this.problemRepository.find();

    let formated =  await problems.map(async (item) => {
      let creator = await this.usersRepository.findOne({ where: { _id: item.userId } });
      if (!creator) throw new HttpErrors.NotFound('User does not exist');
      let creatorProfile = await this.userService.convertToUserProfile(creator);

      return { 
        creatorProfile,
        ...item
      }
    })

    return Promise.all(formated).then((completed) => {
      return completed.sort((a: any, b: any) => b.createdAt - a.createdAt);
    });
  }

  @patch('/problems/{id}/delete')
  @secured(SecuredType.HAS_ANY_ROLE, ['ADMIN'])
  async deleteProblem(
    @param.path.string('id') id: string
  ) {
    await this.problemRepository.updateById(id, {
        deleted: true,
        helperId: '',
        assigned: false,
        status: "DELETED"

    });

    await this.answerRepository.updateAll({
        deleted: true
    }, {
        _id: id
    });

    return 'done';
  }

  @patch('/answers/{id}/delete')
  @secured(SecuredType.HAS_ANY_ROLE, ['ADMIN'])
  async deleteAnswers(
    @param.path.string('id') id: string
  ) {
    await this.answerRepository.updateById(id, {
        deleted: true
    });

    return 'done';
  }

  @patch('/problems/{id}/un-delete')
  @secured(SecuredType.HAS_ANY_ROLE, ['ADMIN'])
  async unDeleteProblem(
    @param.path.string('id') id: string
  ) {
    await this.problemRepository.updateById(id, {
        deleted: false,
        status: "OPEN"
    });

    await this.answerRepository.updateAll({
        deleted: false
    }, {
        _id: id
    });

    return 'done';
  }

  @patch('/answers/{id}/un-delete')
  @secured(SecuredType.HAS_ANY_ROLE, ['ADMIN'])
  async unDeleteAnswers(
    @param.path.string('id') id: string
  ) {
    await this.answerRepository.updateById(id, {
        deleted: false,
    });

    return 'done';
  }
}