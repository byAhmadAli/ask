import { HttpErrors } from '@loopback/rest';
import { UsersRepository } from '../repositories';
import { Users } from '../models/user.model';
import { UserService, UserProfile } from '@loopback/authentication';
import { repository } from '@loopback/repository';
import { PasswordHasher } from './hash.password.service';
import { PasswordHasherBindings } from './keys';
import { inject } from '@loopback/context';
import { Credentials } from './auth.service';

export class AppUserService implements UserService<Users, Credentials> {
  constructor(
    @repository(UsersRepository) public usersRepository: UsersRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher
  ) { }

  async verifyCredentials(credentials: Credentials): Promise<Users> {
    const invalidCredentialsError = 'Invalid email or password.';

    const foundUser = await this.usersRepository.findOne({
      where: {
        or: [
          { email: credentials.email },
          { nickname: credentials.email },
          { _id: credentials.email }
        ]
      }
    });

    if (!foundUser) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }
    const passwordMatched = await this.passwordHasher.comparePassword(
      credentials.password,
      foundUser.password,
    );

    if (!passwordMatched) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }

    return foundUser;
  }

  convertToUserProfile(user: Users): UserProfile {
    // since first name and lastName are optional, no error is thrown if not provided
    const { nickname, email, _id } = user;
    return { id: _id || '', name: nickname, email: email };
  }
}
