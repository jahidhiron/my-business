const router = require('express').Router();
const {isAuthenticated} = require('../middleware/authMiddleware');
const  bagStockValidation = require('../validator/dashboard/bagStockValidation');
const  singlePaddyStockValidation = require('../validator/dashboard/singleBagStockValidation');

const {
    bagStockGetController,
    newBagStockGetController,
    newBagStockPostController,
    singleBagStockGetController
} = require('../controllers/bagStockController');

router.get('/bagStock', isAuthenticated, bagStockGetController);

router.get('/newBagStock', isAuthenticated, newBagStockGetController);
router.post('/newBagStock', isAuthenticated, bagStockValidation, newBagStockPostController);

router.get('/singleBagStock/:bagStockId', isAuthenticated, singleBagStockGetController);

module.exports = router;