# Building a Backend Project From Scratch

## Prerequisites
- Make sure node is installed
  - Use `node -v` in the terminal
- Setup both a server and shadow server on ElephantSQL
  - The main server should have a unique name for this project
  - The same shadow server can be reused for all projects

## Create project setup
NB: If this is not a an existing repo, you will need to create a new directory and cd in to it.

Initialize a Node.js project and add the Prisma CLI as a development dependency to it
- `npm init -y` creates a package.json file, so npm knows what packages your project requires, inclding a Node.js app.
- `npm install prisma --save-dev` saves the name and version of the package being installed in the dev-dependency object.
- `npx prisma` invokes the Prisma CLI (Command Line Interface).
- `npx prisma init` does two things
  - creates a new directory called prisma that contains a file called schema.prisma, which contains the Prisma schema with your database connection variable and schema models
  - creates the .env file in the root directory of the project, which is used for defining environment variables (such as your database connection)
