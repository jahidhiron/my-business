const router = require('express').Router();
const {isAuthenticated} = require('../middleware/authMiddleware');
const sellValidation = require('../validator/dashboard/sellValidator');
// const singleCustomerValidation = require('../validator/dashboard/singleCustomerValidator');

const {
    sellGetController,
    sellPostController
} = require('../controllers/sellController');

router.get('/sell', isAuthenticated, sellGetController);
router.post('/sell', isAuthenticated, sellValidation, sellPostController);

module.exports = router;