import { check } from 'express-validator';

import userConfig from '../db/user/user.config';

export const validateRegistrationData = [
  // Sanitize inputs
  check('username').trim().escape(),
  check('email').trim().normalizeEmail(),
  check('password').trim().escape(),

  // Validate inputs
  check('username').notEmpty().withMessage('Username is required'),
  check('username')
    .isLength({
      min: userConfig.minUsernameLength,
      max: userConfig.maxUsernameLength,
    })
    .withMessage(
      `The username needs to have at least ${userConfig.minUsernameLength} characters, maximum is ${userConfig.maxUsernameLength}.`
    ),

  check('email')
    .isEmail({ ignore_max_length: false })
    .withMessage('Must be a valid email address'),

  check('password')
    .isLength({
      min: userConfig.minPasswordLength,
      max: userConfig.maxPasswordLength,
    })
    .withMessage(
      `The password needs to have at least ${userConfig.minPasswordLength} characters, maximum is ${userConfig.maxPasswordLength}.`
    ),
];
