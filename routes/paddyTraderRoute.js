const router = require('express').Router();
const {isAuthenticated} = require('../middleware/authMiddleware');
const paddyTraderValidation = require('../validator/dashboard/paddyTraderValidator');
const singlePaddyTraderValidation = require('../validator/dashboard/singlePaddyTraderValidator');

const {
    paddyTraderGetController,
    
    newPaddyTraderGetController,
    newPaddyTraderPostController,

    singlePaddyTraderGetController,
    newTransactionPostController
} = require('../controllers/paddyTraderController');

router.get('/paddyTrader', isAuthenticated, paddyTraderGetController);

router.get('/newPaddyTrader', isAuthenticated, newPaddyTraderGetController);
router.post('/newPaddyTrader', isAuthenticated, paddyTraderValidation, newPaddyTraderPostController);

router.get('/singlePaddyTrader/:paddyTraderId', isAuthenticated, singlePaddyTraderGetController);

router.post('/singlePaddyTrader/:paddyTraderId', isAuthenticated, singlePaddyTraderValidation, newTransactionPostController);

module.exports = router;