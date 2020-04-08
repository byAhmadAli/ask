// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { BindingKey } from '@loopback/context';
import { PasswordHasher } from '../services';
import { TokenService, UserService, UserProfile } from '@loopback/authentication';
import { Users } from '../models';
import { Credentials } from '../services';

export namespace EmailCredentials {
  export const EMAIL_USER = 'aounakapp@gmail.com';
  export const EMAIL_PASSWORD = "aounakYa3ounak";
}

export namespace TokenServiceConstants {
  // md5 ask-v0.1
  export const TOKEN_SECRET_VALUE = '3a0104bfc09e1cb841d6d1fa93fc95a8';
  export const TOKEN_EXPIRES_IN_VALUE = "24h";
}

export namespace TokenServiceBindings {
  export const TOKEN_SECRET = BindingKey.create<string>(
    'authentication.jwt.secret',
  );
  export const TOKEN_EXPIRES_IN = BindingKey.create<string>(
    'authentication.jwt.expires.in.seconds',
  );
  export const TOKEN_SERVICE = BindingKey.create<TokenService>(
    'services.authentication.jwt.tokenservice',
  );
  export const CURRENT_USER = BindingKey.create<UserProfile>(
    'authentication.currentUser',
  );
}

export namespace PasswordHasherBindings {
  export const PASSWORD_HASHER = BindingKey.create<PasswordHasher>(
    'services.hasher',
  );
  export const ROUNDS = BindingKey.create<number>('services.hasher.round');
}

export namespace UserServiceBindings {
  export const USER_SERVICE = BindingKey.create<UserService<Users, Credentials>>(
    'services.user.service',
  );
}
