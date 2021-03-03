const {body} = require('express-validator');

module.exports = [
    body('dailyCost')
        .not().isEmpty().withMessage("Cost can't be empty")
];