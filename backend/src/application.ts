import { BootMixin } from '@loopback/boot';
import { ApplicationConfig, BindingKey } from '@loopback/core';
import { RestExplorerBindings, RestExplorerComponent } from '@loopback/rest-explorer';
import { RepositoryMixin } from '@loopback/repository';
import { RestApplication } from '@loopback/rest';
import { ServiceMixin } from '@loopback/service-proxy';
import * as path from 'path';
import { MySequence } from './sequence';
import { AuthenticationBindings } from '@loopback/authentication';
import {
  AppAuthMetadataProvider,
  AppAuthAuthenticationStrategyProvider,
  AppAuthActionProvider,
  AppAuthBindings,
  PasswordHasherBindings,
  BcryptHasher,
  TokenServiceBindings,
  TokenServiceConstants,
  UserServiceBindings,
  AppUserService,
  JWTService
} from './services';
import { genSalt, hash } from 'bcryptjs';
import { UsersRepository, RoleRepository, UserRoleRepository, AnswerRepository, ProblemRepository, ProblemTypeRepository } from './repositories';

export interface PackageInfo {
  name: string;
  version: string;
  description: string;
}

export const PackageKey = BindingKey.create<PackageInfo>('application.package');

const pkg: PackageInfo = require('../package.json');
const ObjectId = require('mongodb').ObjectId;

export class UserApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    this.setUpBindings();

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.bind(RestExplorerBindings.CONFIG).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    // this.component(AuthenticationComponent);
    this.bind(AuthenticationBindings.METADATA).toProvider(AppAuthMetadataProvider);
    this.bind(AppAuthBindings.STRATEGY).toProvider(AppAuthAuthenticationStrategyProvider);
    this.bind(AuthenticationBindings.AUTH_ACTION).toProvider(AppAuthActionProvider);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }

  async hashPassword(
    password: string
  ): Promise<string> {
    const salt = await genSalt(10);
    return await hash(password, salt);
  }

  async seedData() {
    const userRepository: UsersRepository = await this.getRepository(UsersRepository);
    const roleRepository: RoleRepository = await this.getRepository(RoleRepository);
    const userRoleRepository: UserRoleRepository = await this.getRepository(UserRoleRepository);
    const problemTypeRepository: ProblemTypeRepository = await this.getRepository(ProblemTypeRepository);

    let _id;

    //
    try {
      _id = new ObjectId();
      await problemTypeRepository.create({ _id, type: "أشعر بوحدة شديدة" });
      _id = new ObjectId();
      await problemTypeRepository.create({ _id, type: "أنا قلق على عملي" });
      _id = new ObjectId();
      await problemTypeRepository.create({ _id, type: "لدي مشاكل عائلية" });
      _id = new ObjectId();
      await problemTypeRepository.create({ _id, type: "لم أتعلم بعد كيفية ترتيب روتيني اليومي" });
      _id = new ObjectId();
      await problemTypeRepository.create({ _id, type: "غير ذلك" });
    } catch (e) {
      throw e
    }

    // Create user roles
    let adminRole, userRole, helperRole
    try {
      _id = new ObjectId();
      adminRole = await roleRepository.create({ _id, type: 'ADMIN', description: 'admin' });
      _id = new ObjectId();
      userRole = await roleRepository.create({ _id, type: 'USER', description: 'user' });
      _id = new ObjectId();
      helperRole = await roleRepository.create({ _id, type: 'HELPER', description: 'helper' });
    } catch (e) {
      throw e
    }

    // create users
    let adminUser, user, helper;
    let password = await this.hashPassword('hash-this');
    try {
      // Admin user
      _id = new ObjectId();
      adminUser = await userRepository.create({
        _id,
        password: password,
        email: 'admin@mailinator.com',
        nickname: 'red',
        emailVerified: true
      });

      // user
      _id = new ObjectId();
      password = await this.hashPassword('hash-this');
      user = await userRepository.create({
        _id,
        password: password,
        email: 'user@mailinator.com',
        nickname: 'blue',
        emailVerified: true
      });

      // helper
      _id = new ObjectId();
      password = await this.hashPassword('hash-this');
      helper = await userRepository.create({
        _id,
        password: password,
        email: 'helper@mailinator.com',
        nickname: 'green',
        emailVerified: true
      });
    } catch (e) {
      throw e
    }

    // link users
    try {
      // Admin user
      _id = new ObjectId();
      await userRoleRepository.create({ _id, userType: 'ADMIN', roleId: adminRole._id, userId: adminUser._id });

      // user
      _id = new ObjectId();
      await userRoleRepository.create({ _id, userType: 'USER', roleId: userRole._id, userId: user._id });

      // helper
      _id = new ObjectId();
      await userRoleRepository.create({ _id, userType: 'HELPER', roleId: helperRole._id, userId: helper._id });
    } catch (e) {
      throw e
    }
  }

  async deleteData() {
    const usersRepository: UsersRepository = await this.getRepository(UsersRepository);
    const roleRepository: RoleRepository = await this.getRepository(RoleRepository);
    const userRoleRepository: UserRoleRepository = await this.getRepository(UserRoleRepository);
    const answerRepository: AnswerRepository = await this.getRepository(AnswerRepository);
    const problemRepository: ProblemRepository = await this.getRepository(ProblemRepository);
    const problemTypeRepository: ProblemTypeRepository = await this.getRepository(ProblemTypeRepository);


    await usersRepository.deleteAll();
    await roleRepository.deleteAll();
    await userRoleRepository.deleteAll();
    await answerRepository.deleteAll();
    await problemRepository.deleteAll();
    await problemTypeRepository.deleteAll();
  }

  setUpBindings(): void {
    // Bind package.json to the application context
    this.bind(PackageKey).to(pkg);

    this.bind(TokenServiceBindings.TOKEN_SECRET).to(
      TokenServiceConstants.TOKEN_SECRET_VALUE,
    );

    this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(
      TokenServiceConstants.TOKEN_EXPIRES_IN_VALUE,
    );

    this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(JWTService);

    // // Bind bcrypt hash services
    this.bind(PasswordHasherBindings.ROUNDS).to(10);
    this.bind(PasswordHasherBindings.PASSWORD_HASHER).toClass(BcryptHasher);

    this.bind(UserServiceBindings.USER_SERVICE).toClass(AppUserService);
  }
}
