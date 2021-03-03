const router = require('express').Router();

const signupValidator = require('../validator/auth/signupValidator');
const {unAuthenticated} = require('../middleware/authMiddleware');
const loginValidator = require('../validator/auth/loginValidator');
const {
    signupGetController,
    signupPostController,
    loginGetController,
    loginPostController,
    logoutGetController
} = require('../controllers/authController');

router.get('/signup', unAuthenticated, signupGetController);
router.post('/signup', unAuthenticated, signupValidator, signupPostController);

router.get('/login', unAuthenticated, loginGetController);
router.post('/login', unAuthenticated, loginValidator, loginPostController);

router.get('/logout', logoutGetController);

module.exports = router;