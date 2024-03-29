// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/authentication
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { inject } from '@loopback/context';
import { HttpErrors } from '@loopback/rest';
import { promisify } from 'util';
import { TokenService, UserProfile } from '@loopback/authentication';
import { TokenServiceBindings, TokenServiceConstants } from './keys';

const jwt = require('jsonwebtoken');
const signAsync = promisify(jwt.sign);
const verifyAsync = promisify(jwt.verify);

export class JWTService implements TokenService {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SECRET)
    private jwtSecret: string,
    @inject(TokenServiceBindings.TOKEN_EXPIRES_IN)
    private jwtExpiresIn: string,
  ) { }

  async verifyToken(token: string): Promise<UserProfile> {
    if (!token) {
      throw new HttpErrors.Unauthorized(
        `Error verifying token : 'token' is null`,
      );
    }

    let userProfile: UserProfile;

    try {
      // decode user profile from token
      const decodedToken = await verifyAsync(token, this.jwtSecret);
      // don't copy over  token field 'iat' and 'exp', nor 'email' to user profile
      userProfile = Object.assign(
        { id: '', name: '', email: '' },
        { id: decodedToken.id, name: decodedToken.name, email: decodedToken.email },
      );
    } catch (error) {
      throw new HttpErrors.Unauthorized(
        `Error verifying token : ${error.message}`,
      );
    }

    return userProfile;
  }

  async generateToken(userProfile: UserProfile): Promise<string> {
    if (!userProfile) {
      throw new HttpErrors.Unauthorized(
        'Error generating token : userProfile is null',
      );
    }

    // Generate a JSON Web Token
    let token: string;

    try {
      token = await signAsync(userProfile, this.jwtSecret, {
        expiresIn: this.jwtExpiresIn,
      });
    } catch (error) {
      throw new HttpErrors.Unauthorized(`Error encoding token : ${error}`);
    }

    return token;
  }
}

export async function generatePasswordToken(userProfile: UserProfile, exp: string): Promise<string> {
  if (!userProfile) {
    throw new HttpErrors.Unauthorized(
      'Error generating token : userProfile is null',
    );
  }

  // Generate a JSON Web Token
  let token: string;

  try {
    token = await signAsync(userProfile, TokenServiceConstants.TOKEN_SECRET_VALUE, {
      expiresIn: exp,
    });
  } catch (error) {
    throw new HttpErrors.Unauthorized(`Error encoding token : ${error}`);
  }

  return token;
}
