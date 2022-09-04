const express = require('express');
const { 
    createUser, updateUser
} = require('../controllers/user')

const router = express.Router();

// In index.js, we told express that the /customer route should use this router file
// The below /register route extends that, so the end result will be a URL
// that looks like http://localhost:4000/customer/register
router.post("/register", createUser);
router.put("/:id", updateUser);

module.exports = router;