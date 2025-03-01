# [FlutterNest](https://flutternest.wise-ee.xyz/)

Website can be visited at: [_https://flutternest.wise-ee.com/_](https://flutternest.wise-ee.com/)  
FlutterNest is a fullstack Twitter-like, feature-rich app made with tests and a public REST API.

## Features

- Frontend and backend, separated into their own packages
- Authentication with JWT
- CRUD operations for users, posts, comments, reposts, likes
- Uploading images via S3
- Pagination for posts
- Standard stuff that you'd expect from a basic social media app

### [Full Postman API Documentation can be found HERE](https://www.postman.com/team-wisie/workspace/flutternest)

## Improvements

In the future, I plan to add (once I actually find the time):

- A realtime chat system
  - 1-1 chats
  - Group chats
- A search engine - I'm thinking of using Algolia
- A CMS UI for admins to manage posts, users, reports, configurations without having to hardcode them
- CI/CD pipeline with automated builds, deployments and tests
- User features:
  - User blocking
  - User following
- Post features:
  - An actual post algorithm 💥🔮💀
  - Post bookmarking
  - Videos and posts attachment handling
  - Post reporting
  - More stuff to add to your posts, like polls, voting
- Code:
  - Better error handling
  - More tests
  - Better documentation
  - For frontend:
    - UX
    - Animations
    - <strong>Performance and accessibility</strong>
    - Use more cached functions - useMemo, useCallback, useRef
    - Maybe use shadcn ui for components
    - Use more components, make them reusable and even more generic
    - Handle the duplicated code better
    - State management improvements, maybe use some library
    - Replace axios for querying 😭😭
    - Rewrite frontend into next.js
    - Write a mobile version with react-native
  - For backend:
    - Once drizzle-kit supports views, use them and redesign the database
    - In general a redesign of the database is needed once drizzle is developed better
    - Use more middlewares
    - Organize model handlers better
    - Rewrite backend into nest.js

## Contribution

- `git clone`, `pnpm i` in the root folder
- Create a `.env` file and fill it with:
  - Your Postgresql DB connection details
  - NODE_ENV, PORT variables
  - JWT details (ref to [auth.controller.ts](backend/src/controllers/auth.controller.ts) file)
- `pnpm start`, fix any bugs that arise ([contact me directly](https://portfolio.wise-ee.xyz/contact) if needed)
- Once you confirm the database works as intended, run `pnpm run generate` and `pnpm run migrate` in the `./backend` folder
- Start coding and enjoy 🤠

### Notes:

- This is a monorepo, so it includes separate `package.json` files in **_backend_**, **_frontend_** and **_test-app_** folders
- Please notice different Node environments: _development_ and _production_ when testing/contributing
