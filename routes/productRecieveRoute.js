const router = require('express').Router();
const {isAuthenticated} = require('../middleware/authMiddleware');
const recieveProductValidation = require('../validator/dashboard/recieveProductValidator');
// const singleCustomerValidation = require('../validator/dashboard/singleCustomerValidator');

const {
    productRecieveGetController,
    productRecievePostController
} = require('../controllers/productRecieveController');

router.get('/productRecieve', isAuthenticated, productRecieveGetController);
router.post('/productRecieve', isAuthenticated, recieveProductValidation, productRecievePostController);

module.exports = router;