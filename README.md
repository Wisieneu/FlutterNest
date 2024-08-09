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

### [Full API Documentation can be found HERE](https://bold-robot-61970.postman.co/workspace/TweetSphere~63d6cd21-0e0f-4b4a-ac90-2a3d7f199df2/collection/27584367-82b4995c-9505-4b00-8706-5c13136bcc1c?action=share&creator=27584367&active-environment=27584367-b138162e-8fa4-4e40-8091-01f9e7f470d8)

## Contribution

- `git clone`, `npm i`
- Create a `.env` file and fill it with:
  - Your Postgresql DB connection details
  - NODE_ENV, PORT variables
  - JWT details (ref to [auth.controller.ts](backend/src/controllers/auth.controller.ts) file)
- `npm start`, fix any bugs ([contact me directly](https://portfolio.wise-ee.xyz/contact) if needed)
- Start coding and enjoy 🤠

### Notes:

- This is a monorepo, so it includes separate `package.json` files in **_backend_** and **_frontend_** folders
- Please notice different Node environments: _development_ and _production_ when testing/contributing
