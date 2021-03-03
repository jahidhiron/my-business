const router = require('express').Router();
const {isAuthenticated} = require('../middleware/authMiddleware');
const onCashValidation = require('../validator/dashboard/onCashValidator');
// const singleCustomerValidation = require('../validator/dashboard/singleCustomerValidator');

const {
    onCashGetController,
    newTransactionPostController
} = require('../controllers/onCashController');

router.get('/onCash', isAuthenticated, onCashGetController);
router.post('/onCash', isAuthenticated, onCashValidation, newTransactionPostController);

module.exports = router;