const {body} = require('express-validator');

module.exports = [
    body('name')
        .not().isEmpty().withMessage("Name can't be empty"),

    body('debitBag')
        .not().isEmpty().withMessage("Debit Bag can't be empty"),

    body('debit')
        .not().isEmpty().withMessage("Debit can't be empty"),

    body('quantity')
        .not().isEmpty().withMessage("Quantity can't be empty"),

    body('weight')
        .not().isEmpty().withMessage("Weight can't be empty"),

    body('price')
        .not().isEmpty().withMessage("Price can't be empty"),

];