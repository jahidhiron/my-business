const {body} = require('express-validator');

module.exports = [
    body('name')
        .not().isEmpty().withMessage("Name can't be empty")
        .isLength({min: 4}).withMessage("Too small. Minimum 4 chracter")
        .isLength({max: 50}).withMessage("Too large. Maximum 50 chracter")
        .trim(),

    body('banglaName')
        .not().isEmpty().withMessage("Bangla name can't be empty")
        .trim(),

    body('phone')
        .not().isEmpty().withMessage("Phone Number can't be empty")
        .isLength({max: 15}).withMessage("Phone Number too large")
        .trim(),

    body('village')
        .not().isEmpty().withMessage("Village can't be empty")
        .trim(),

    body('thana')
        .not().isEmpty().withMessage("Thana can't be empty")
        .trim(),

    body('district')
        .not().isEmpty().withMessage("District can't be empty")
        .trim(),
];