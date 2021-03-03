const router = require('express').Router();
const {isAuthenticated} = require('../middleware/authMiddleware');

const {
    searchController
} = require('../controllers/searchController');

router.get('/search', isAuthenticated, searchController);

module.exports = router;