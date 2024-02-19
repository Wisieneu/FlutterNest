export default {
  minUsernameLength: 5,
  maxUsernameLength: 32,
  maxEmailLength: 256,
  maxPasswordLength: 128,
  minPasswordLength: 8,
  roleTypes: ['user', 'mod', 'admin'],
} as const;

export type roleType = 'user' | 'mod' | 'admin';
