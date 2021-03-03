const router = require('express').Router();
const {isAuthenticated} = require('../middleware/authMiddleware');
const staffValidator = require('../validator/dashboard/staffValidator');

const {
    staffGetController,
    staffPostController,

    newStaffGetController,
    newStaffPostController,

    singleStaffGetController,

    newTransactionPostController
} = require('../controllers/staffController');

router.get('/staff',  isAuthenticated, staffGetController);
router.post('/staff',  isAuthenticated, staffPostController);

router.get('/newStaff', isAuthenticated, newStaffGetController);
router.post('/newStaff', isAuthenticated, staffValidator, newStaffPostController);

router.get('/singleStaff/:staffId', isAuthenticated, singleStaffGetController);

router.post('/singleStaff/:staffId', isAuthenticated, newTransactionPostController);

module.exports = router;