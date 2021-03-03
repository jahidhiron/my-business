const {body} = require('express-validator');
const User = require('../../models/User');

module.exports = [
    body('email')
        .normalizeEmail()
        .not().isEmpty().withMessage("Email can't be empty")
        .isEmail().withMessage("Please provide a valid email")
        .custom(async email => {
            let user = await User.findOne({email});
            if(user){
                return Promise.reject("Email already exist");
            }
        }),

    body('password')
        .not().isEmpty().withMessage("Password can't be empty")
        .isLength({min: 5}).withMessage("Password too small, Minimum 5 Character")
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/,).withMessage("At least one uppercase, one lowercase and one special character"),

    body('confirmPassword')
        .not().isEmpty().withMessage("Confirm password can't be empty")
        .custom((confirmPassword, {req}) => {
            if(confirmPassword !== req.body.password){
                throw new Error("Password doesn't match");
            }
            return true;
        })
];