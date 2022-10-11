const express = require('express');
const router = new express.Router;

const User = require('../controllers/User');

router.get('/', (_, res) => res.send("hey API works !"));

// User Routes
router.get('/users', User.getUsers);
router.get('/users/:id', User.getUserById);
router.put('/users/:id', User.editUser);
router.post("/login", User.loginUser);
router.post('/register', User.createUser);
router.delete('/users/:id', User.deleteUser);

module.exports = router;