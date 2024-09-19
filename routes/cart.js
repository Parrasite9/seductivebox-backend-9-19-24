const express = require('express');
const router = express.Router();
const { storeAbandonedCart } = require('../controllers/cartController');

// Store abandoned cart data
router.post('/store', storeAbandonedCart);

module.exports = router;
