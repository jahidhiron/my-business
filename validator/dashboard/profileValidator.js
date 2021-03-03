const {body} = require('express-validator');
const validator = require('validator');

const linkValidator = value => {
    if(value){
        if(!validator.isURL(value)){
            throw new Error("Please provide a valid URL");
        }
    }
    return true;
}

module.exports = [
    body('name')
        .not().isEmpty().withMessage("Name can't be empty")
        .isLength({min: 4}).withMessage("Too small. Minimum 4 chracter")
        .isLength({max: 50}).withMessage("Too large. Maximum 50 chracter")
        .trim(),

    body('phone')
        .not().isEmpty().withMessage("Phone Number can't be empty")
        .isLength({max: 15}).withMessage("Phone Number too large")
        .trim(),

    body('bio')
        .isLength({max: 500}).withMessage("Too large, Maximum 500 character")
        .trim(),

    body('website')
        .custom(linkValidator),

    body('website')
        .custom(linkValidator),

    body('facebook')
        .custom(linkValidator),

    body('twitter')
        .custom(linkValidator),

    body('linkedin')
        .custom(linkValidator),

    body('github')
        .custom(linkValidator)
];