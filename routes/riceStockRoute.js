const router = require('express').Router();
const {isAuthenticated} = require('../middleware/authMiddleware');
const  riceStockValidation = require('../validator/dashboard/riceStockValidator');
const  singleRiceStockValidation = require('../validator/dashboard/singleRiceStockValidator');

const {
    riceStockGetController,
    newRiceStockGetController,
    newRiceStockPostController,
    singleRiceStockGetController,
    newTransactionPostController
} = require('../controllers/riceStockController');

router.get('/riceStock', isAuthenticated, riceStockGetController);

router.get('/newRiceStock', isAuthenticated, newRiceStockGetController);
router.post('/newRiceStock', isAuthenticated, riceStockValidation, newRiceStockPostController);

router.get('/singleRiceStock/:riceStockId', isAuthenticated, singleRiceStockGetController);
router.post('/singleRiceStock/:riceStockId', isAuthenticated, singleRiceStockValidation, newTransactionPostController);

module.exports = router;