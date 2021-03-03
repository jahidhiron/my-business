const {validationResult} = require('express-validator');
const errorFormatter = require('../utils/validationErrorFormatter');
const Flash = require('../utils/Flash');

const Product = require('../models/Product');

// all product
exports.productGetController = async (req, res, next) => {
    let product = await Product.find();
    res.render('pages/dashboard/product/product',{
        title: "All Products | Barik Enterprise",
        product,
        flashMessage: Flash.getMessage(req),
        errors: {}
    });
}

// new product
exports.newProductGetController = (req, res, next) => {
    res.render('pages/dashboard/product/newProduct',{
        title: "New Product | Barik Enterprise",
        flashMessage: Flash.getMessage(req),
        errors: {}
    });
}

exports.newProductPostController = async (req, res, next) => {
    let errors = validationResult(req).formatWith(errorFormatter);  
    if(!errors.isEmpty()){
        return res.render('pages/dashboard/product/newProduct',{
            title: "New Product | Barik Enterprise",
            flashMessage: Flash.getMessage(req),
            errors: errors.mapped()
        });
    }

    let {
        name,
        banglaName,
        type
    } = req.body;
    name = name.toLowerCase(name.toString());

    try{
        let newProduct = await Product.findOne({name});
        if(newProduct){
            req.flash('fail', 'Product Already Exist');
            return res.render('pages/dashboard/product/newProduct',{
                title: "New Product | Barik Enterprise",
                flashMessage: Flash.getMessage(req),
                errors: errors.mapped()
            });
        }

        let date = new Date();
        let month = date.getMonth();
        let product = new Product({
            name,
            banglaName,
            type,
            date: date.getDate() + '/' + month + '/' + date.getFullYear()
        });

        await product.save();

        req.flash('success', 'New Product Created Successfully');
        res.redirect('/dashboard/product');

    }catch(error){
        next(error);
    }
}
