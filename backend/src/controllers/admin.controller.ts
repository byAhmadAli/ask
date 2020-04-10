import { repository } from '@loopback/repository';
import { inject } from '@loopback/core';
import { HttpErrors } from '@loopback/rest';
import {
  param,
  del,
  patch
} from '@loopback/openapi-v3';

import {
  ProblemRepository,
  AnswerRepository
} from '../repositories';

import {
  secured,
  SecuredType
} from '../services';

export class AdminController {
  constructor(
    @repository(ProblemRepository)
    private problemRepository: ProblemRepository,
    @repository(AnswerRepository)
    private answerRepository: AnswerRepository,
  ) { }

  @patch('/problems/{id}/delete')
  @secured(SecuredType.HAS_ANY_ROLE, ['ADMIN'])
  async deleteProblem(
    @param.path.string('id') id: string
  ) {
    await this.problemRepository.updateById(id, {
        deleted: true
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
        deleted: false
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
        deleted: false
    });

    return 'done';
  }
}