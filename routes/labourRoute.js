const router = require('express').Router();
const {isAuthenticated} = require('../middleware/authMiddleware');
const labourValidator = require('../validator/dashboard/labourValidator');

const {
    labourGetController,

    newLabourGetController,
    newLabourPostController,

    singleLabourGetController,

    newTransactionPostController
} = require('../controllers/labourController');

router.get('/labour',  isAuthenticated, labourGetController);

router.get('/newLabour', isAuthenticated, newLabourGetController);
router.post('/newLabour', isAuthenticated, labourValidator, newLabourPostController);

router.get('/singleLabour/:labourId', isAuthenticated, singleLabourGetController);

router.post('/singleLabour/:labourId', isAuthenticated, newTransactionPostController);

module.exports = router;