export default {
  minUsernameLength: 5,
  maxUsernameLength: 32,
  maxEmailLength: 256,
  maxPasswordLength: 64,
  minPasswordLength: 8,
  defaultProfilePicture: 'default.png',
  roleTypes: ['user', 'mod', 'admin'],
} as const;

export type roleType = 'user' | 'mod' | 'admin';
