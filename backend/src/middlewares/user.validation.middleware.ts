import { check } from 'express-validator';

import userConfig from '../db/user/user.config';

export const validateRegistrationData = [
  // Sanitize inputs
  check('username').trim().escape(),
  check('email').trim().normalizeEmail(),
  check('password').trim().escape(),

  // Validate inputs
  check('username')
    .notEmpty()
    .withMessage('Username is required')
    .isLength({
      min: userConfig.minUsernameLength,
      max: userConfig.maxUsernameLength,
    })
    .withMessage(
      `The username needs to have ${userConfig.minUsernameLength} - ${userConfig.maxUsernameLength} characters`
    ),

  check('email')
    .isEmail({ ignore_max_length: false })
    .withMessage('Email must be valid'),

  check('password')
    .isLength({
      min: userConfig.minPasswordLength,
      max: userConfig.maxPasswordLength,
    })
    .withMessage(
      `The password needs to have ${userConfig.minPasswordLength} - ${userConfig.maxPasswordLength} characters`
    ),
];
