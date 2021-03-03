const bcrypt = require("bcrypt");
const {validationResult} = require('express-validator');
const errorFormatter = require('../utils/validationErrorFormatter');
const Flash = require('../utils/Flash');

const User = require('../models/User');

exports.settingGetController = (req, res, next) => {
    res.render("pages/dashboard/setting", {
        title: "Update Password | Barik Enterprise",
        errors: {},
        flashMessage: Flash.getMessage(req)
    });
};

exports.settingPostController = async (req, res, next) => {
    let errors = validationResult(req).formatWith(errorFormatter);
    const { 
        oldPassword,
        newPassword
    } = req.body;

    if(!errors.isEmpty()){
        return res.render("pages/dashboard/setting", {
            title: "Signup | Barik Enterprise",
            errors: errors.mapped(),
            flashMessage: Flash.getMessage(req)
        });
    }
    
    try {
        let match = await bcrypt.compare(oldPassword, req.user.password);
        if(!match){
            req.flash('fail', "Password doesn't match");
            return res.render("pages/dashboard/setting", {
                title: "Login | Barik Enterprise",
                errors: {},
                flashMessage: Flash.getMessage(req)
            });
        }

        if(oldPassword === newPassword){
            req.flash('fail', "Old Password");
            return res.render("pages/dashboard/setting", {
                title: "Login | Barik Enterprise",
                errors: {},
                flashMessage: Flash.getMessage(req)
            });
        }

        let hashPassword = await bcrypt.hash(newPassword, 11);

        await User.findOneAndUpdate(
            {_id: req.user._id},
            {$set: {password: hashPassword}}
        );

        req.flash('success', 'Password Changed Successfully');
        res.redirect('/dashboard/setting');

    } catch (error) {
        next(error);
    }
};