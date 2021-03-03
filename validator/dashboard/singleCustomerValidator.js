const {body} = require('express-validator');

module.exports = [
    body('name')
        .not().isEmpty().withMessage("Name can't be empty"),

    body('quantity')
        .not().isEmpty().withMessage("Quantity can't be empty")
        .trim(),

    body('price')
        .not().isEmpty().withMessage("Price can't be empty")
        .trim(),

    body('credit')
        .not().isEmpty().withMessage("Credit can't be empty")
];