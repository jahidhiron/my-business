const router = require('express').Router();
const {isAuthenticated} = require('../middleware/authMiddleware');
const  settingValidation = require('../validator/dashboard/settingValidator');

const {
    settingGetController,
    settingPostController
} = require('../controllers/settingController');

router.get('/setting', isAuthenticated, settingGetController);
router.post('/setting', isAuthenticated, settingValidation, settingPostController);

module.exports = router;