const router = require('express').Router();
const {isAuthenticated} = require('../middleware/authMiddleware');
const costValidation = require('../validator/dashboard/costValidator');
const singleCostValidation = require('../validator/dashboard/singleCostValidator');

const {
    costGetController,
    newCostGetController,
    newCostPostController,
    singleCostrGetController,
    newTransactionPostController
} = require('../controllers/costController');

router.get('/cost', isAuthenticated, costGetController);
router.get('/newCost', isAuthenticated, newCostGetController);
router.post('/newCost', isAuthenticated, costValidation, newCostPostController);
router.get('/singleCost/:costId', isAuthenticated, singleCostrGetController);
router.post('/singleCost/:costId', isAuthenticated, singleCostValidation, newTransactionPostController);

module.exports = router;