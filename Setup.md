# Building a Backend Project From Scratch

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
  - paste your primary URL in to DATABASE_URL from your ElephantSQL server in, being careful to leave the `?schema=` in place.
  - paste `SHADOW_DATABASE_URL="?schema=shadow"` in below the DATABASE_URL
  - paste your shadow database URL in to SHADOW_DATABASE_URL

_Ensure your .env file is included in .gitignore_

## Creating the database schema (Using Prisma Schema)
<https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases/using-prisma-migrate-node-postgres>
- Open schema.prisma and create a simple table model to test your migrate with
  - model Id { id Int @id @default(autoincrement()) }
- run `npx prisma migrate dev --name init` to map your model to the database schema. This command does two things:
  - It creates a new SQL migration file for this migration
  - It runs the SQL migration file against the database


During the Using Prisma Migrate step, only add one model with an id column but no relations or other fields. This is enough to get migrations working.
