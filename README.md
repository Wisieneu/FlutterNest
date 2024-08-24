# [FlutterNest](https://flutternest.wise-ee.xyz/)

Website can be visited at: [_https://flutternest.wise-ee.xyz/_](https://flutternest.wise-ee.xyz/)  
FlutterNest is a fullstack Twitter-like, feature-rich app made with tests and a public REST API.

## Features

- Frontend and backend, separated into their own packages
- Authentication with JWT
- CRUD operations for users, posts, comments, reposts, likes
- Pagination for posts
- Searching for posts
- Uploading images via S3

### [Full Postman API Documentation can be found HERE](https://www.postman.com/team-wisie/workspace/flutternest)

## Contribution

- `git clone`, `pnpm i` in the root folder
- Create a `.env` file and fill it with:
  - Your Postgresql DB connection details
  - NODE_ENV, PORT variables
  - JWT details (ref to [auth.controller.ts](backend/src/controllers/auth.controller.ts) file)
- `pnpm start`, fix any bugs ([contact me directly](https://portfolio.wise-ee.xyz/contact) if needed)
- Start coding and enjoy 🤠

### Notes:

- This is a monorepo, so it includes separate `package.json` files in **_backend_** and **_frontend_** folders
- Please notice different Node environments: _development_ and _production_ when testing/contributing
