const {body} = require('express-validator');

module.exports = [
    body('customerName')
        .not().isEmpty().withMessage("Customer Name can't be empty")
        .trim(),

    body('productName')
        .not().isEmpty().withMessage("Product Name can't be empty")
        .trim(),

    body('quantity')
        .not().isEmpty().withMessage("Quantity can't be empty")
        .trim(),

    body('price')
        .not().isEmpty().withMessage("Price can't be empty")
        .trim()
];