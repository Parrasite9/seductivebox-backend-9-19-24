const express = require('express');
const router = express.Router();
const { createUser, recoverCart } = require('../controllers/usersController');

// Route to create user and save questionnaire responses
router.post('/create', createUser);

// Route to recover abandoned cart
router.get('/recover/:email', recoverCart);

module.exports = router;
