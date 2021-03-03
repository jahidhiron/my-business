const {body} = require('express-validator');

module.exports = [
    body('name')
        .not().isEmpty().withMessage("Name can't be empty")
        .isLength({min: 3}).withMessage("Too small. Minimum 3 chracter")
        .isLength({max: 50}).withMessage("Too large. Maximum 50 chracter")
        .trim(),

    body('banglaName')
        .not().isEmpty().withMessage("Bangla Name can't be empty")
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
        .not().isEmpty().withMessage("District can't be empty"),

    body('area')
        .not().isEmpty().withMessage("District can't be empty")

];