const {body} = require('express-validator');

module.exports = [
    body('quantity')
        .not().isEmpty().withMessage("Quantity can't be empty"),

    body('price')
        .not().isEmpty().withMessage("Price can't be empty")
];