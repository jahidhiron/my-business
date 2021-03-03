const bcrypt = require("bcrypt");
const {validationResult} = require('express-validator');
const errorFormatter = require('../utils/validationErrorFormatter');
const Flash = require('../utils/Flash');

const User = require("../models/User");

exports.signupGetController = (req, res, next) => {
    res.render("pages/auth/signup", {
        title: "Signup | Barik Enterprise",
        values: {},
        errors: {},
        flashMessage: Flash.getMessage(req)
    });
};

exports.signupPostController = async (req, res, next) => {
    let errors = validationResult(req).formatWith(errorFormatter);
    const { email, password, confirmPassword } = req.body;

    if(!errors.isEmpty()){
        return res.render("pages/auth/signup", {
            title: "Signup | Barik Enterprise",
            values: {
                email,
                password,
                confirmPassword
            },
            errors: errors.mapped(),
            flashMessage: Flash.getMessage(req)
        });
    }
    
    try {
        let hashPassword = await bcrypt.hash(password, 11);

        let user = new User({
            email,
            password: hashPassword,
        });

        await user.save();

        req.flash('success', 'User Created Successfully');
        res.redirect('/auth/login');

    } catch (error) {
        next(error);
    }
};

exports.loginGetController = (req, res, next) => {
    res.render("pages/auth/login", {
        title: "Login | Barik Enterprise",
        errors: {},
        flashMessage: Flash.getMessage(req)
    });
};

exports.loginPostController = async (req, res, next) => {
    let errors = validationResult(req).formatWith(errorFormatter);
    let {email, password} = req.body;

    if(!errors.isEmpty()){
        return res.render("pages/auth/login", {
            title: "Login | Barik Enterprise",
            errors: errors.mapped(),
            flashMessage: Flash.getMessage(req)
        });
    }

    try{
        let user = await User.findOne({email})
        if(!user){
            req.flash('fail', 'Invalid Credential');
            return res.render("pages/auth/login", {
                title: "Login | Barik Enterprise",
                errors: {},
                flashMessage: Flash.getMessage(req)
            });
        }

        let match = await bcrypt.compare(password, user.password);
        if(!match){
            req.flash('fail', 'Invalid Credential');
            return res.render("pages/auth/login", {
                title: "Login | Barik Enterprise",
                errors: {},
                flashMessage: Flash.getMessage(req)
            });
        }

        req.session.isLoggedIn = true;
        req.session.user = user;
        req.session.save(error => {
            if(error){
                return next(error);
            }
            req.flash('success', 'Successfully Logged In');
            res.redirect('/dashboard');
        });

    }catch(error){
        next(error);
    }
};

exports.logoutGetController = (req, res, next) => {
    req.session.destroy(error => {
        if(error){
            return next(error);
        }

        return res.redirect('/auth/login');
    });
};
