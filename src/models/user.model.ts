// export const users = pgTable(
//   'users',
//   {
//     id: serial('id').primaryKey(),
//     nickname: varchar('nickname', { length: 20 }),
//     email: text('email'),
//     active: boolean('active').default(true),
//     role: varchar('role', { enum: ['user', 'admin'] }).default('user'),
//     password: varchar('password', { length: 64 }),
//     passwordLastChanged: timestamp('passwordLastChanged'),
//   },
// );

// export const User: userType =
