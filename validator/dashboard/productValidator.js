const {body} = require('express-validator');

module.exports = [
    body('name')
        .not().isEmpty().withMessage("Name can't be empty")
        .isLength({max: 50}).withMessage("Too large. Maximum 50 chracter")
        .trim(),

    body('banglaName')
        .not().isEmpty().withMessage("Bengali Name can't be empty")
        .isLength({max: 50}).withMessage("Too large. Maximum 50 chracter")
        .trim(),

    body('type')
        .not().isEmpty().withMessage("Product type can't be empty")
];