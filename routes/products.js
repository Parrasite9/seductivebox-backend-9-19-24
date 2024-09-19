const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');

// POST route for importing products
router.post('/import-products', productsController.importProducts);

module.exports = router;
