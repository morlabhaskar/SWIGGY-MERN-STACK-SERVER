const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router();

router.post('/add-product/:firmId',productController.addProduct);
// router.get('/:banana/products',productController.getProductByFirm);
router.get('/:banana',productController.getProductByFirm);

module.exports = router;