import { repository } from '@loopback/repository';
import {
  UserService,
  TokenService
} from '@loopback/authentication';
import {
  requestBody,
  patch,
  param,
  post,
  get
} from '@loopback/openapi-v3';

import { inject } from '@loopback/core';
import { HttpErrors } from '@loopback/rest';

import {
  UsersRepository,
  UserRoleRepository,
  RoleRepository,
  UserSettingsRepository
} from '../repositories';
import {
  Credentials,
  PasswordHasherBindings,
  PasswordHasher,
  TokenServiceBindings,
  UserServiceBindings,
  validateCredentials,
  isValidEmail,
  generatePasswordToken,
  composeMail,
  secured,
  SecuredType,
} from '../services';
import {
  Users,
  IUserModel,
  IUserCredentials,
  IUserReset
} from '../models';

import * as _ from 'lodash';
const ObjectId = require('mongodb').ObjectId;
const faker = require('faker');

export class UserController {
  constructor(
    @repository(UsersRepository) private usersRepository: UsersRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: UserService<Users, Credentials>,
    @repository(UserRoleRepository)
    private userRoleRepository: UserRoleRepository,
    @repository(RoleRepository)
    private roleRepository: RoleRepository,
    @repository(UserSettingsRepository)
    private userSettingsRepository: UserSettingsRepository,

    @inject(TokenServiceBindings.CURRENT_USER, { optional: true })
    private currentUser: any,
  ) { }

  @post('/user/create')
  async createUser(
    @requestBody({
      content: { 'application/json': { schema: { 'x-ts-type': IUserModel } } }
    }) user: Users
  ): Promise<object> {

    validateCredentials(_.pick(user, ['email', 'password']));

    let findUser = await this.usersRepository.findOne({ where: { email: user.email } });
    if (findUser) throw new HttpErrors.UnprocessableEntity('Email is already taken');

    findUser = await this.usersRepository.findOne({ where: { nickname: user.nickname } });
    if (findUser) throw new HttpErrors.UnprocessableEntity('Nickname is already taken');

    user.password = await this.passwordHasher.hashPassword(user.password);

    try {
      // create the new user
      user._id = new ObjectId();
      user.email = user.email.toLocaleLowerCase()
      user.nickname = user.nickname.toLocaleLowerCase();
      
      const savedUser = await this.usersRepository.create(user);
      delete savedUser.password;
      let _id = new ObjectId();

      const userRole = await this.roleRepository.findOne({ where: { type: "USER" } });
      if (!userRole) throw new HttpErrors.UnprocessableEntity('Role not found');

      await this.userRoleRepository.create({ _id, userType: "USER", roleId: userRole._id, userId: savedUser._id });
      _id = new ObjectId();
      await this.userSettingsRepository.create({
        _id,
        userId: savedUser._id
      });

      const userProfile = this.userService.convertToUserProfile(user);
      const token = await this.jwtService.generateToken(userProfile);

      const mailOptions = {
        from: 'Ahmad Ali <hello@ahmadali.me>',
        to: `${user.email}`,
        subject: 'Welcome!',
        html: `
          <p>
            Hello,
            <br/><br/>
            Thanks for creating an account with Fadfed. Click below to confirm your email address:
            <br/>
            <a href="http://localhost:3000/user/verify-email/${token}">http://localhost:3000/user/verify-email/${token}</a>
            <br/><br/>
            If you have problems, please paste the above URL into your web browser.
            <br/><br/>
            <br/><br/>
            Thanks,
            Fadfed Team
          </p>
        `
      };

      composeMail.sendMail(mailOptions, function (err: any, info: any) {
        if (err)
          console.log(err)
        else
          console.log(info);
      });

      return {
        token,
        user: savedUser
      };
    } catch (error) {
      throw error;
    }
  }

  @post('/user/reset')
  async resetPassword(
    @requestBody({
      content: { 'application/json': { schema: { 'x-ts-type': IUserReset } } },
    }) user: IUserReset
  ): Promise<object> {
    isValidEmail(user.email);

    const findUser = await this.usersRepository.findOne({ where: { email: user.email } });
    if (!findUser) throw new HttpErrors.UnprocessableEntity('Email is not registered');

    const userProfile = this.userService.convertToUserProfile(findUser);

    const token = await generatePasswordToken(userProfile, '5m');

    const mailOptions = {
      from: 'Ahmad Ali <hello@ahmadali.me>',
      to: `${user.email}`,
      subject: 'Reset password!',
      html: `
        <p>
          Hello,
          <br/><br/>
          Someone requested that the password be reset for the following account:
          <br/>
          Email: ${findUser.email}
          <br/>
          If this was a mistake, just ignore this email and nothing will happen.
          <br/><br/>
          To reset your password, visit the following address:
          <br/>
          <a href="http://localhost:3000/user/change-password/${token}">http://localhost:3000/user/change-password/${token}</a>
          <br/><br/>
          If you have problems, please paste the above URL into your web browser.
          <br/><br/>
          <br/><br/>
          Thanks,
          Fadfed Team
        </p>
      `
    };

    composeMail.sendMail(mailOptions, function (err: any, info: any) {
      if (err)
        console.log(err)
      else
        console.log(info);
    });

    return {
      massage: 'check your email'
    };
  }

  @get('/user/verify-email/{token}')
  async verifyEmail(
    @param.path.string('token') token: string,
  ): Promise<void> {
    const verifyToken = await this.jwtService.verifyToken(token);
    const findUser = await this.usersRepository.findOne({ where: { email: verifyToken.email } });
    if (!findUser) throw new HttpErrors.UnprocessableEntity('Email is not registered');

    await this.usersRepository.updateById(findUser._id, { emailVerified: true, updatedAt: new Date() });
  }

  @patch('/user/create/password/{token}')
  async newPassword(
    @param.path.string('token') token: string,
  ): Promise<void> {
    const verifyToken = await this.jwtService.verifyToken(token);

  }

  @post('/users/login')
  async login(
    @requestBody({
      content: { 'application/json': { schema: { 'x-ts-type': IUserCredentials } } },
    }) credentials: Credentials
  ): Promise<object> {
    credentials.email = credentials.email.toLocaleLowerCase()

    const user = await this.userService.verifyCredentials(credentials);
    const userProfile = await this.userService.convertToUserProfile(user);
    const token = await this.jwtService.generateToken(userProfile);

    return {
      token,
      user: userProfile
    };
  }

  @get('/users/nickname')
  async nickname(
  ): Promise<object> {
    let nickname = faker.internet.userName().toLocaleLowerCase();
    let checkNickname = false;

    while (!checkNickname) {
      let findUser = await this.usersRepository.findOne({ where: { nickname: nickname } });
      if (!findUser) {
        checkNickname = true;
        break;
      }
      nickname = faker.internet.userName().toLocaleLowerCase();
    }

    return {nickname: nickname};
  }

  @get('/users/profile')
  @secured(SecuredType.IS_AUTHENTICATED)
  async profile() {
    const findUser = await this.usersRepository.findOne({ where: { email: this.currentUser.id } });
    if (!findUser) throw new HttpErrors.NotFound('User does not exist');

    const roles = await this.userRoleRepository.find({ where: { userId: findUser._id } });
    const getUserRole = roles.map((r: any) => r.userType);

    const userProfile: any = await this.userService.convertToUserProfile(findUser);
    userProfile.role = getUserRole;
    if(!getUserRole.includes('USER')){
      userProfile.roleId = roles[0].roleId;
    }
    return userProfile;
  }
}