import { HttpErrors } from '@loopback/rest';
import * as validator from 'validator';
import { Credentials } from './auth.service';

const passwordValidator = require('password-validator');
const schema = new passwordValidator();

schema
  .is().min(8)
  .is().max(25);

export function isValidEmail(email: string) {
  if (!validator.isEmail(email)) {
    throw new HttpErrors.UnprocessableEntity('Email is invalid');
  }
}
export function validateCredentials(credentials: Credentials) {
  // Validate Email
  if (!validator.isEmail(credentials.email)) {
    throw new HttpErrors.UnprocessableEntity('Email is invalid');
  }

  // Validate Password Length
  if (!schema.validate(credentials.password)) {
    throw new HttpErrors.UnprocessableEntity(
      "The password you entered doesn't meet the minimum security requirements, Try one that's longer or more complex.",
    );
  }
}
