import { check } from 'express-validator';

import userConfig from '../db/user/user.config';

// if (!username || !email || !password) {
//   return new AppError(
//     'At least one of the required credentials is missing.',
//     400
//   );
// } else if (
//   username.length > userConfig.maxUsernameLength ||
//   username.length < userConfig.minUsernameLength
// ) {
//   return new AppError(
//     `Username needs to have at least ${userConfig.minUsernameLength} characters, maximum is ${userConfig.maxUsernameLength}.`,
//     400
//   );
// } else if (!isEmail(email) || email.length > userConfig.maxEmailLength) {
//   return new AppError('The provided email is not a valid email', 400);
// } else if (
//   password.length > userConfig.maxPasswordLength ||
//   username.length < userConfig.minPasswordLength
// ) {
//   return new AppError(
//     `The password needs to have at least ${userConfig.minPasswordLength} characters, maximum is ${userConfig.maxPasswordLength}.`,
//     400
//   );
// } else {
//   return null;
// }

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
