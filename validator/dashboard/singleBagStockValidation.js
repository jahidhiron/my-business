const {body} = require('express-validator');

module.exports = [
    body('quantity')
        .not().isEmpty().withMessage("Quantity can't be empty")
];