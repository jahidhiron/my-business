const router = require('express').Router();
const {isAuthenticated} = require('../middleware/authMiddleware');
// const recieveProductValidation = require('../validator/dashboard/recieveProductValidator');
// const singleCustomerValidation = require('../validator/dashboard/singleCustomerValidator');

const {
    calculationGetController,
    profitGetController,
    allCostGetController,
    labourCostGetController,
    transportCostGetController,
    millCostGetController,
    extraGetController
} = require('../controllers/calculationController');

router.get('/calculation', isAuthenticated, calculationGetController);

router.get('/profit', isAuthenticated, profitGetController);
router.get('/allCost', isAuthenticated, allCostGetController);
router.get('/labourCost', isAuthenticated, labourCostGetController);
router.get('/transportCost', isAuthenticated, transportCostGetController);
router.get('/millCost', isAuthenticated, millCostGetController);
router.get('/extraCost', isAuthenticated, extraGetController);

module.exports = router;