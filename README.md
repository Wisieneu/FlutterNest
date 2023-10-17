# TweetSphere

TweetSphere is a fullstack Twitter-like, feature-rich Typescript application made with tests and a public REST API.

### [Full API Documentation can be found HERE](https://bold-robot-61970.postman.co/workspace/TweetSphere~63d6cd21-0e0f-4b4a-ac90-2a3d7f199df2/collection/27584367-82b4995c-9505-4b00-8706-5c13136bcc1c?action=share&creator=27584367&active-environment=27584367-b138162e-8fa4-4e40-8091-01f9e7f470d8)

Please note different environments: `development` and `production` when testing/contributing.

## Contribution

### If you would like to launch this app on your machine and contribute, you're going to need to have your own PosgreSQL instance.

1. Get its connection string
2. Create a ".env" file located in the project's root folder
3. In that file, assign the connection string to a DATABASE_URL variable
4. Run `npm i` to get all of the project's dependencies
5. Run `npx prisma migrate "migration_name"` to create a migration and apply it to your database.
6. In the same file, assign a PORT variable specifying which port should the development server be running on
7. Run API CRUD tests to make sure your database is configured properly //TODO:
8. Run `npm start` / `nodemon` / `ts-node .\src\server.ts` to get the dev server up and running

In case if you need any assistance, do not hesitate to contact me via my business mail from my github profile.
