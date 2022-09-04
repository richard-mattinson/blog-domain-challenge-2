# Building a Backend Project From Scratch

# Setting up your database

## Prerequisites
- Make sure node is installed
  - Use `node -v` in the terminal
- Setup both a server and shadow server on ElephantSQL
  - The main server should have a unique name for this project
  - The same shadow server can be reused for all projects

## Create project setup
<https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases-node-postgres>

_NB: If this is not a an existing repo, you will need to create a new directory and cd in to it._

Initialize a Node.js project and add the Prisma CLI as a development dependency to it
- `npm init -y` creates a package.json file, so npm knows what packages your project requires, inclding a Node.js app.
- `npm install prisma --save-dev` saves the name and version of the package being installed in the dev-dependency object.
- `npx prisma` invokes the Prisma CLI (Command Line Interface).
- `npx prisma init` does two things
  - creates a new directory called prisma that contains a file called schema.prisma, which contains the Prisma schema with your database connection variable and schema models
  - creates the .env file in the root directory of the project, which is used for defining environment variables (such as your database connection)

## Connecting your database
<https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases/connect-your-database-node-postgres>
- open the new prisma/schema.prisma file
- add `shadowDatabaseUrl = env("SHADOW_DATABASE_URL")` to the third line of datasource db, this is to connect your shadow database
- in the .env file
  - change the primary schema from `?schema=public` to `?schema=prisma`
  - paste your primary URL in to DATABASE_URL from your ElephantSQL server in, being careful to leave the `?schema=prisma` in place.
  - paste `SHADOW_DATABASE_URL="?schema=shadow"` in below the DATABASE_URL
  - paste your shadow database URL in to SHADOW_DATABASE_URL

_Ensure your .env file is included in .gitignore_

## Creating the database schema (Using Prisma Schema)
<https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases/using-prisma-migrate-node-postgres>
- Open schema.prisma and create a simple table model to test your migrate with
```prisma
model Test {
  id Int @id @default(autoincrement())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```
- run `npx prisma migrate dev --name init` to map your model to the database schema. This command does two things:
  - It creates a new SQL migration file for this migration
  - It runs the SQL migration file against the database

## Install and generate Prisma Client
<https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases/install-prisma-client-node-postgres>

- `npm install @prisma/client` to install the Prisma client package. The install command automatically invokes prisma generate for you which reads your Prisma schema and generates a version of Prisma Client that is tailored to your models.
- Whenever you make changes to your Prisma schema in the future, you manually need to invoke prisma generate in order to accommodate the changes in your Prisma Client API.

## Seeding your database with JavaScript
<https://www.prisma.io/docs/guides/database/seed-database>
- Open package.json, between "scripts" and "repository" paste the following
```json
"prisma": {
  "seed": "node prisma/seed.js"
},
```
- Inside the prisma folder, create a file called `seed.js` 
- Paste in the text below
```javascript
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
const test = await prisma.test.create({ data: { title: 'I am a test' } });

    console.log({ test })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
  ```
- `npx prisma db seed` to seed the database with this new info

## Prisma command cheat sheet

- `npx prisma generate` to recompile the prisma client, allowing you to access your new models on the prisma client object (e.g. `prisma.user.create`)

- `npx prisma migrate dev --create-only --skip-seed --name NameOfYourMigrationFile` to create a new migration file for each model you add / change without applying it straight to the database

- `npx prisma migrate reset` to reset your database structure, apply all of your migrations in sequence and run your seed file
- `npx prisma format` auto formats the schema file
- `npm migrate prisma db push`

# Set up your API

1. Run `npm install -D nodemon` to install [nodemon](https://www.npmjs.com/package/nodemon) as a development dependency
2. Run `npm install express cors morgan` to install ExpressJS, Morgan and cors
    - [What is cors?](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) (tldr; It allows us to make requests to our API from another domain)
3. Replace the `"test"` script in `package.json` with a `"start"` script, use `"nodemon src/index.js"` as the value
    - This allows us to start our app using the `npm start` command. It'll use nodemon to run an index.js file in a directory called `src`, and every time you make any changes to your code the app will automatically restart.
4. Create the `src` directory with an `index.js` file inside
5. Set up express in the `index.js` file using [this example](https://expressjs.com/en/starter/hello-world.html) and your previous exercises as references
```javascript
// Require middleware
const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
app.disable("x-powered-by");

// Add middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Tell express to use your routers here
const userRouter = require("./routers/user");
app.use("/user", userRouter);

// Set the port
const port = 3000;

// Start API server
app.listen(port, () => {
  console.log(`\n Server is running on http://localhost:${port}\n`);
});
```
6. Create folders inside src called **controllers** and **routers**
7. Inside both folders create files named after your first table in the schema, e.g. **users.js**
8. The users file in `controllers` should look like this:
```javascript
const { Prisma } = require("@prisma/client")

// create a new POST request in Insomnia with the route http://localhost:3000/user/register to test this works
const createUser = async (req, res) => {
    res.json({msg: "I'm all hooked up"})
}

module.exports = {
    createUser
}
```
9. The users file in `routers` should look like this:
```javascript
const express = require('express');
const {
    createUser
} = require('../controllers/user')

const router = express.Router();

// In index.js, we told express that the /customer route should use this router file
// The below /register route extends that, so the end result will be a URL that looks like http://localhost:4000/customer/register
router.post("/register", createUser);
// router.put("/:id", updateCustomer);

module.exports = router;
```
10. For each new route in your conctoller file you need to 
    1.  Export that route at the bottom of conctoller/tablename.js
    2.  Add the require at the top of routes/tablename.js
    3.  Add the router at the bottom of routes/tablename.js, with the relevant CRUD operation (get, post, put, delete)
