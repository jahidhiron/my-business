const router = require('express').Router();
const {isAuthenticated} = require('../middleware/authMiddleware');
const bagTraderValidation = require('../validator/dashboard/bagTraderValidator');
const singleBagTraderValidation = require('../validator/dashboard/singleBagTraderValidator');

const {
    bagTraderGetController,
    newBagTraderGetController,
    newBagTraderPostController,
    singleBagTraderGetController,
    newTransactionPostController
} = require('../controllers/bagTraderController');

router.get('/bagTrader', isAuthenticated, bagTraderGetController);

router.get('/newBagTrader', isAuthenticated, newBagTraderGetController);
router.post('/newBagTrader', isAuthenticated, bagTraderValidation, newBagTraderPostController);

router.get('/singleBagTrader/:bagTraderId', isAuthenticated, singleBagTraderGetController);

router.post('/singleBagTrader/:bagTraderId', isAuthenticated, singleBagTraderValidation, newTransactionPostController);

module.exports = router;