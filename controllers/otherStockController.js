const {validationResult} = require('express-validator');
const errorFormatter = require('../utils/validationErrorFormatter');
const Flash = require('../utils/Flash');

const OtherStock = require('../models/OtherStock');

exports.otherStockGetController = async (req, res, next) => {
    let otherStock = await OtherStock.find();
    
    res.render('pages/dashboard/otherStock/otherStock',{
        title: "Other Stock | Barik Enterprise",
        otherStock,
        flashMessage: Flash.getMessage(req)
    });
}

exports.newOtherStockGetController = async (req, res, next) => {
    res.render('pages/dashboard/otherStock/newOtherStock',{
        title: "Other Stock | Barik Enterprise",
        flashMessage: Flash.getMessage(req),
        errors: {}
    });
}

exports.newOtherStockPostController = async (req, res, next) => {
    let errors = validationResult(req).formatWith(errorFormatter);
    
    if(!errors.isEmpty()){
        return res.render('pages/dashboard/otherStock/newOtherStock', {
            title: "Other Stock | Barik Enterprise",
            flashMessage: Flash.getMessage(req),
            errors: errors.mapped()
        }); 
    }

    let {
        name
    } = req.body;

    try{
        let newOtherStock = await OtherStock.findOne({name});
        
        if(newOtherStock){
            req.flash('fail', `Stock of ${name.charAt(0).toUpperCase() + name.slice(1)} Already Exist`);
            return res.render('pages/dashboard/otherStock/newOtherStock', {
                title: "Paddy Stock | Barik Enterprise",
                flashMessage: Flash.getMessage(req),
                errors: errors.mapped()
            }); 
        } 
        let otherStock = new OtherStock({
            name,
            avgPrice: 0,
            totalQuantity: 0,
            totalWeight: 0,
            netPrice: 0,
            transactions: []
        });

        await otherStock.save();

        req.flash('success', 'New Other Stock Created Successfully');
        res.redirect('/dashboard/otherStock');

    }catch(error){
        next(error);
    }
}

exports.singleOtherStockGetController = async (req, res, next) => {
    let otherStockId = req.params.otherStockId;
    let otherStock = await OtherStock.findOne({_id: otherStockId});
    console.log(otherStock)
    try{
        res.render('pages/dashboard/otherStock/singleOtherStock',{
            title: `${otherStock.name} | Barik Enterprise`,
            otherStock,
            flashMessage: Flash.getMessage(req),
            errors: {}
        });

    }catch(error){
        next(error);
    }
}

exports.newTransactionPostController = async (req, res, next) => {
    let errors = validationResult(req).formatWith(errorFormatter);
    let otherStock = await OtherStock.find();

    if(!errors.isEmpty()){
        return res.render('pages/dashboard/otherStock/singleOtherStock', {
            title: "Other Stock | Barik Enterprise",
            otherStock,
            flashMessage: Flash.getMessage(req),
            errors: errors.mapped()
        }); 
    }

    let otherStockId = req.params.otherStockId;
    let date = new Date();

    let {
        quantity,
        price
    } = req.body;

    quantity = parseInt(quantity);
    price = parseInt(price);
    let totalPrice = quantity * price;
    
    try{
        let month = date.getMonth() + 1;
        let transactions = [
            {
                quantity,
                totalPrice,
                date: date.getDate() + '/' + month + '/' + date.getFullYear()
            }
        ];

        await OtherStock.findOneAndUpdate(
            {_id: otherStockId},
            {$push: {transactions}}
        );

        otherStock = await OtherStock.findById(otherStockId);
        
        let weight = parseInt(otherStock.name.split(' ')[1]);
        let totalQuantity = otherStock.totalQuantity + quantity;
        let totalWeight = otherStock.totalWeight + (weight * quantity) / 40;
        let netPrice = otherStock.netPrice + totalPrice;
        let avgPrice = netPrice / totalQuantity;
        if(totalQuantity === 0){
            avgPrice = 0;
        }

        await OtherStock.findOneAndUpdate(
            {_id: otherStockId},
            {$set: {totalQuantity, totalWeight, netPrice, avgPrice}}
        );

        req.flash('success', 'New Transaction Created Successfully');
        res.redirect(`/dashboard/singleOtherStock/${otherStockId}`);
        
    }catch(error){
        next(error);
    }
}