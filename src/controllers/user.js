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
    include: { profile: true, },
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
// UPDATE A USER 201 ()
// - User with that id does not exist 404 (x)
// - User with the provided username / email already exists 409 (x)
const updateUser = async (req, res) => {
  try {
  const id = Number(req.params.id);
  const { username, email, password, firstName, lastName, age, pictureUrl } =
    req.body;
  const checkForExistingUser = await prisma.user.findMany({
    where: {
        OR: [
        { username: username }, { email: email }
      ],
    }
  });
  const findUserToUpdate = await prisma.user.findUnique({
    where: { id: id }
  })

  if (!password || !firstName || !lastName || !age || !pictureUrl) throw 400;
  if (findUserToUpdate === null) throw 404;
  if (checkForExistingUser.length !== 0) throw 409;

    const updatedUser = await prisma.user.create({
      where: {
        id: id
      },
      data: {
        username,
        email,
        password,
        profile: {
          create: {
            firstName,
            lastName,
            age,
            pictureUrl,
          },
        },
      },
      include: { profile: true, },
    });
    res.status(201).json({ user: updatedUser });

  } catch (error) {
    if (error === 400) {
      res.status(400).json({ error: errors.missingFields });
    } else if (error === 404) {
      res.status(404).json({ error: `User ${errors.pageNotFound}` });
    } else if (error === 409) {
      res.status(409).json({ error: `Username or email ${errors.alreadyExists}` });
    } else {
      res.status(500).json({ error: errors.serverError });
    }
  }
} 

// DELETE A USER 201 (x)
// - User with that id does not exist 404 (x)
const deleteUser = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const findUserToDelete = await prisma.user.findUnique({
      where: { id: id },
    });
    if (findUserToDelete === null) throw 404;

    await prisma.profile.delete({ where: { userId: id } });

    const deletedUser = await prisma.user.delete({
      where: { id: id }
    })
    res.status(201).json({ user: deletedUser });

  } catch (error) {
    if (error = 404) {
      res.status(404).json({ error: `User ${errors.pageNotFound}`})
    } else {
      res.status(500).json({ error: errors.serverError });
    }
  }
}

module.exports = {
  createUser,
  updateUser,
  deleteUser,
};
