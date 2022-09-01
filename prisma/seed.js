const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seed() {
  await createUser();
  const posts = await createPost();
  // const categories = await createPosts();
  // await createComments(posts, profiles);
  process.exit(0);
}

async function createUser() {
  const user = await prisma.user.create({
    data: {
      username: "DonkeyDes",
      email: "thewonkymess@gds.co.uk",
      password: "youCheekyBOOM365",
      profile: {
        create: {
          firstName: "Des",
          lastName: "Des",
          age: 2,
          pictureUrl: "http://www.pix/ohjesus.png"
        },
      },
    },
    include: {
      profile: true,
    },
  });

  console.log("User created", user);
  return user;
}

async function createPost() {
  const post = await prisma.post.create({
    data: {
      title: "I like explosions",
      content: "no really, i really do",
      imageUrl: "http://www.pix/splosion.tiff",
    },
  });
  return post;
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
