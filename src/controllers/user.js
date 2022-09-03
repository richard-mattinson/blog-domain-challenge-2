const { Prisma } = require("@prisma/client");
const prisma = require("../utlis/prisma");
// const user = ("user")
// const table = user
const { errors } = require("../utlis/errors");

// create user 201 (x)
// - missing field in request body 400 (x)
// - user already exists 409 ()
const createUser = async (req, res) => {
  const { 
    username, 
    email, 
    password, 
    firstName, 
    lastName, 
    age, 
    pictureUrl } =
    req.body;

if(!username || !email || !password || !firstName || !lastName || !age || !pictureUrl) {
    return res.status(400).json({
        error: errors.missingFields
    })
}

  try {
    const createdUser = await prisma.user.create({
      data: {
        username,
        email,
        password,
        profile: {
          create: {
            firstName,
            lastName,
            age,
            pictureUrl
          },
        },
      },
      // We add an `include` outside of the `data` object to make sure the new contact is returned in the result
      // This is like doing RETURNING in SQL
      include: {
        profile: true,
      },
    });
    res.status(201).json({ user: createdUser });

  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return res
          .status(409)
          .json({ error: `User ${errors.exists}` });
      }
    }

    res.status(500).json({ error: e.message });
  }
};

module.exports = {
  createUser,
};
