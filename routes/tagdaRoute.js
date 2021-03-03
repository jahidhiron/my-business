const router = require('express').Router();
const {isAuthenticated} = require('../middleware/authMiddleware');

const {
    tagdaGetController
} = require('../controllers/tagdaController');

router.get('/tagda', isAuthenticated, tagdaGetController);

module.exports = router;