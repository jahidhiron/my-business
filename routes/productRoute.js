const router = require('express').Router();
const {isAuthenticated} = require('../middleware/authMiddleware');
const productValidator = require('../validator/dashboard/productValidator');

const {
    productGetController,
    newProductGetController,
    newProductPostController
} = require('../controllers/productController');

router.get('/product', isAuthenticated, productGetController);

router.get('/newProduct', isAuthenticated, newProductGetController);
router.post('/newProduct', isAuthenticated, productValidator, newProductPostController);

module.exports = router;