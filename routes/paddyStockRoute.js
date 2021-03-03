const router = require('express').Router();
const {isAuthenticated} = require('../middleware/authMiddleware');
const  paddyStockValidation = require('../validator/dashboard/paddyStockValidator');
const  singlePaddyStockValidation = require('../validator/dashboard/singlePaddyStockValidator');

const {
    paddyStockGetController,

    newPaddyStockGetController,
    newPaddyStockPostController,

    singlePaddyStockGetController,
    newTransactionPostController
} = require('../controllers/paddyStockController');

router.get('/paddyStock', isAuthenticated, paddyStockGetController);

router.get('/newPaddyStock', isAuthenticated, newPaddyStockGetController);
router.post('/newPaddyStock', isAuthenticated, paddyStockValidation, newPaddyStockPostController);

router.get('/singlePaddyStock/:paddyStockId', isAuthenticated, singlePaddyStockGetController);

router.post('/singlePaddyStock/:paddyStockId', isAuthenticated, singlePaddyStockValidation, newTransactionPostController);

module.exports = router;