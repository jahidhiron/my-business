const {body} = require('express-validator');

module.exports = [
    body('oldPassword')
        .not().isEmpty().withMessage("Old Password can't be empty"),
        
    body('newPassword')
        .not().isEmpty().withMessage("New Password can't be empty")
        .isLength({min: 5}).withMessage("New Password too small, Minimum 5 Character")
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/,).withMessage("At least one uppercase, one lowercase and one special character"),

    body('confirmPassword')
        .not().isEmpty().withMessage("Confirm password can't be empty")
        .custom((confirmPassword, {req}) => {
            if(confirmPassword !== req.body.newPassword){
                throw new Error("Password doesn't match");
            }
            return true;
        })

];