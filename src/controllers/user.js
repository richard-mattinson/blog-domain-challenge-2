const { Prisma } = require("@prisma/client");
const prisma = require("../utlis/prisma");
// const user = ("user")
// const table = user
const { errors } = require("../utlis/errors");

// create user 201 (x)
// - missing field in request body 400 (x)
// - user already exists 409 (x)
const createUser = async (req, res) => {
try {
  const { username, email, password, firstName, lastName, age, pictureUrl } = req.body;
  const checkForExistingUser = await prisma.user.findMany({where: {username: username}})
    
  if(!username || !email || !password || !firstName || !lastName || !age || !pictureUrl) 
    throw 400
  if (checkForExistingUser.length !== 0) throw 409

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
    include: {
      profile: true,
    },
  });
  res.status(201).json({ user: createdUser });

} catch (error) {
  if (error === 400) {
    res.status(400).json({ error: errors.missingFields})
  } else if (error === 409) {
      res.status(409).json({ error: `User ${errors.alreadyExists}` });
    } else if (error === 404) {
      res.status(404).json({ error: `User ${errors.pageNotFound}` });
    } else {
      res.status(500).json({ error: errors.serverError });
    }
  }
};

module.exports = {
  createUser,
};
