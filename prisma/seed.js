const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seed() {
    await createUser();
    const profiles = await createUser();
    const posts = await createProfile();
    const categories = await createPosts(); 
    await createComments(posts, profiles);
    process.exit(0);
}

async function createUser() {
    const user = await prisma.user.create({
        username: 'Des',
        email: 'thewonkymess@gds.co.uk',
        password: 'youCheekyBOOM365',
    })

    console.log("User created", user);

    return user;
}

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
