const router = require('express').Router();
const {isAuthenticated} = require('../middleware/authMiddleware');
const customerValidation = require('../validator/dashboard/customerValidator');
const singleCustomerValidation = require('../validator/dashboard/singleCustomerValidator');

const {
    customerGetController,
    customerByAreaGetController,
    customerTagdaGetController,
    customerTagdaPostController,
    newCustomerGetController,
    newCustomerPostController,
    singleCustomerGetController,
    newTransactionPostController,
} = require('../controllers/customerController');

router.get('/customer', isAuthenticated, customerGetController);
router.get('/customer/:area', isAuthenticated, customerByAreaGetController);

router.get('/tagda/:area', isAuthenticated, customerTagdaGetController);
router.post('/customer/:area', isAuthenticated, customerTagdaPostController);

router.get('/newCustomer', isAuthenticated, newCustomerGetController);
router.post('/newCustomer', isAuthenticated, customerValidation, newCustomerPostController);

router.get('/singleCustomer/:customerId', isAuthenticated, singleCustomerGetController);
router.post('/singleCustomer/:customerId', isAuthenticated, singleCustomerValidation, newTransactionPostController);

module.exports = router;