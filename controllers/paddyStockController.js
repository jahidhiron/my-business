const {validationResult} = require('express-validator');
const errorFormatter = require('../utils/validationErrorFormatter');
const Flash = require('../utils/Flash');

const PaddyStock = require('../models/PaddyStock');
const Product = require('../models/Product');

// stock
exports.paddyStockGetController = async (req, res, next) => {
    let paddyStock = await PaddyStock.find();
    
    res.render('pages/dashboard/paddyStock/paddyStock',{
        title: "Paddy Stock | Barik Enterprise",
        paddyStock,
        flashMessage: Flash.getMessage(req)
    });
}

exports.newPaddyStockGetController = async (req, res, next) => {
    let product = await Product.find();
    res.render('pages/dashboard/paddyStock/newPaddyStock',{
        title: "Paddy Stock | Barik Enterprise",
        product,
        flashMessage: Flash.getMessage(req),
        errors: {}
    });
}

exports.newPaddyStockPostController = async (req, res, next) => {
    let errors = validationResult(req).formatWith(errorFormatter);
    let product = await Product.find();

    if(!errors.isEmpty()){
        return res.render('pages/dashboard/paddyStock/newPaddyStock', {
            title: "Paddy Stock | Barik Enterprise",
            product,
            flashMessage: Flash.getMessage(req),
            errors: errors.mapped()
        }); 
    }

    let {
        name
    } = req.body;

    try{
        let singleProduct = await Product.findOne({name: name});
        let newPaddyStock = await PaddyStock.findOne({productId: singleProduct._id});
        
        if(newPaddyStock){
            req.flash('fail', `Stock of ${name.charAt(0).toUpperCase() + name.slice(1)} Already Exist`);
            return res.render('pages/dashboard/paddyStock/newPaddyStock', {
                title: "Paddy Stock | Barik Enterprise",
                product,
                flashMessage: Flash.getMessage(req),
                errors: errors.mapped()
            }); 
        } 
        let paddyStock = new PaddyStock({
            name,
            banglaName: singleProduct.banglaName,
            productId: singleProduct._id,
            avgPrice: 0,
            totalQuantity: 0,
            totalWeight: 0,
            netPrice: 0,
            transactions: []
        });

        await paddyStock.save();

        req.flash('success', 'New Paddy Stock Created Successfully');
        res.redirect('/dashboard/paddyStock');

    }catch(error){
        next(error);
    }
}

exports.singlePaddyStockGetController = async (req, res, next) => {
    let paddyStockId = req.params.paddyStockId;
    let paddyStock = await PaddyStock.findOne({_id: paddyStockId});

    try{
        res.render('pages/dashboard/paddyStock/singlePaddyStock',{
            title: `${paddyStock.name} | Barik Enterprise`,
            paddyStock,
            flashMessage: Flash.getMessage(req),
            errors: {}
        });

    }catch(error){
        next(error);
    }
}

exports.newTransactionPostController = async (req, res, next) => {
    let errors = validationResult(req).formatWith(errorFormatter);
    let paddyStock = await PaddyStock.find();

    if(!errors.isEmpty()){
        return res.render('pages/dashboard/paddyStock/singlePaddyStock', {
            title: "Paddy Stock | Barik Enterprise",
            paddyStock,
            flashMessage: Flash.getMessage(req),
            errors: errors.mapped()
        }); 
    }

    let paddyStockId = req.params.paddyStockId;
    let date = new Date();

    let {
        quantity
    } = req.body;

    quantity = parseInt(quantity);

    paddyStock = await PaddyStock.findById(paddyStockId);
    let weight = (paddyStock.totalWeight / paddyStock.totalQuantity) * quantity;
    let totalPrice = weight * paddyStock.avgPrice;
    
    try{
        let month = date.getMonth();
        let transactions = [
            {
                quantity,
                weight,
                totalPrice,
                date: date.getDate() + '/' + month + '/' + date.getFullYear()
            }
        ];

        await PaddyStock.findOneAndUpdate(
            {_id: paddyStockId},
            {$push: {transactions}}
        );

        paddyStock = await PaddyStock.findById(paddyStockId);

        let totalQuantity = paddyStock.totalQuantity - quantity;
        let totalWeight = paddyStock.totalWeight - weight;
        let netPrice = paddyStock.netPrice - totalPrice;
        let avgPrice = paddyStock.avgPrice;
        if(totalWeight === 0){
            avgPrice = 0;
        }

        await PaddyStock.findOneAndUpdate(
            {_id: paddyStockId},
            {$set: {totalQuantity, totalWeight, netPrice, avgPrice}}
        );

        req.flash('success', 'New Transaction Created Successfully');
        res.redirect(`/dashboard/singlePaddyStock/${paddyStockId}`);
        
    }catch(error){
        next(error);
    }
}