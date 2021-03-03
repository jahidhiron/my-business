const router = require('express').Router();
const {isAuthenticated} = require('../middleware/authMiddleware');
const  otherStockValidation = require('../validator/dashboard/otherStockValidator');
const  singleOtherStockValidation = require('../validator/dashboard/singleOtherStockValidator');

const {
    otherStockGetController,
    newOtherStockGetController,
    newOtherStockPostController,
    singleOtherStockGetController,
    newTransactionPostController
} = require('../controllers/otherStockController');

router.get('/otherStock', isAuthenticated, otherStockGetController);

router.get('/newOtherStock', isAuthenticated, newOtherStockGetController);
router.post('/newOtherStock', isAuthenticated, otherStockValidation, newOtherStockPostController);

router.get('/singleOtherStock/:otherStockId', isAuthenticated, singleOtherStockGetController);

router.post('/singleOtherStock/:otherStockId', isAuthenticated, singleOtherStockValidation, newTransactionPostController);

module.exports = router;