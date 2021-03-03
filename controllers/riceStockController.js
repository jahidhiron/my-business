const {validationResult} = require('express-validator');
const errorFormatter = require('../utils/validationErrorFormatter');
const Flash = require('../utils/Flash');

const RiceStock = require('../models/RiceStock');
const Product = require('../models/Product');
const BagStock = require('../models/BagStock');

exports.riceStockGetController = async (req, res, next) => {
    let riceStock = await RiceStock.find();
    
    res.render('pages/dashboard/riceStock/riceStock',{
        title: "Rice Stock | Barik Enterprise",
        riceStock,
        flashMessage: Flash.getMessage(req)
    });
}

exports.newRiceStockGetController = async (req, res, next) => {
    let product = await Product.find();
    res.render('pages/dashboard/riceStock/newRiceStock',{
        title: "New Rice Stock | Barik Enterprise",
        product,
        flashMessage: Flash.getMessage(req),
        errors: {}
    });
}

exports.newRiceStockPostController = async (req, res, next) => {
    let errors = validationResult(req).formatWith(errorFormatter);
    let product = await Product.find();

    if(!errors.isEmpty()){
        return res.render('pages/dashboard/riceStock/newRiceStock', {
            title: "New Rice Stock | Barik Enterprise",
            product,
            flashMessage: Flash.getMessage(req),
            errors: errors.mapped()
        }); 
    }

    let {
        name,
        type
    } = req.body;

    let singleProduct = await Product.findOne({name});
    name = singleProduct.banglaName + ' ' + type;
    try{
        let newRiceStock = await RiceStock.findOne({name});
        
        if(newRiceStock){
            req.flash('fail', `Stock of ${name.charAt(0).toUpperCase() + name.slice(1)} Already Exist`);
            return res.render('pages/dashboard/riceStock/newRiceStock', {
                title: "New Rice Stock | Barik Enterprise",
                product,
                flashMessage: Flash.getMessage(req),
                errors: errors.mapped()
            }); 
        } 
        let riceStock = new RiceStock({
            name,
            banglaName: singleProduct.banglaName,
            avgPrice: 0,
            totalQuantity: 0,
            totalWeight: 0,
            netPrice: 0,
            transactions: []
        });

        await riceStock.save();

        req.flash('success', 'New Rice Stock Created Successfully');
        res.redirect('/dashboard/riceStock');

    }catch(error){
        next(error);
    }
}

exports.singleRiceStockGetController = async (req, res, next) => {
    let riceStockId = req.params.riceStockId;
    let riceStock = await RiceStock.findOne({_id: riceStockId});

    try{
        res.render('pages/dashboard/riceStock/singleRiceStock',{
            title: `${riceStock.name} | Barik Enterprise`,
            riceStock,
            flashMessage: Flash.getMessage(req),
            errors: {}
        });

    }catch(error){
        next(error);
    }
}

exports.newTransactionPostController = async (req, res, next) => {
    let errors = validationResult(req).formatWith(errorFormatter);
    let riceStock = await RiceStock.find();

    if(!errors.isEmpty()){
        return res.render('pages/dashboard/riceStock/singleRiceStock', {
            title: "Rice Stock | Barik Enterprise",
            riceStock,
            flashMessage: Flash.getMessage(req),
            errors: errors.mapped()
        }); 
    }

    let riceStockId = req.params.riceStockId;
    let date = new Date();

    let {
        quantity,
        price
    } = req.body;

    quantity = parseInt(quantity);
    price = parseInt(price);
    let totalPrice = quantity * price;
    
    try{
        let month = date.getMonth();
        let transactions = [
            {
                quantity,
                totalPrice,
                date: date.getDate() + '/' + month + '/' + date.getFullYear()
            }
        ];

        await RiceStock.findOneAndUpdate(
            {_id: riceStockId},
            {$push: {transactions}}
        );

        riceStock = await RiceStock.findById(riceStockId);
        
        let weight = parseInt(riceStock.name.split(' ')[1]);
        let totalQuantity = riceStock.totalQuantity + quantity;
        let totalWeight = riceStock.totalWeight + (weight * quantity) / 40;
        let netPrice = riceStock.netPrice + totalPrice;
        let avgPrice = netPrice / totalQuantity;
        if(totalQuantity === 0){
            avgPrice = 0;
        }

        await RiceStock.findOneAndUpdate(
            {_id: riceStockId},
            {$set: {totalQuantity, totalWeight, netPrice, avgPrice}}
        );

        let bag25 = await BagStock.findOne({name: '25 kg bag'});
        let bag50 = await BagStock.findOne({name: '50 kg bag'});
        let riceWeight = riceStock.name.split(' ');

        if(riceWeight[1]== 25){
            let avgPrice = bag25.avgPrice;
            let totalQuantity = bag25.totalQuantity - quantity;
            let netPrice = avgPrice * totalQuantity;
            if(totalQuantity){
                avgPrice = 0;
            }

            await BagStock.findOneAndUpdate(
                {_id: bag25._id},
                {$set: {totalQuantity, netPrice, avgPrice}}
            );
        }else if(riceWeight[1] == 50){
            let avgPrice = bag50.avgPrice;
            let totalQuantity = bag50.totalQuantity - quantity;
            let netPrice = avgPrice * totalQuantity;
            if(totalQuantity){
                avgPrice = 0;
            }

            await BagStock.findOneAndUpdate(
                {_id: bag50._id},
                {$set: {totalQuantity, netPrice, avgPrice}}
            );
        }

        req.flash('success', 'New Transaction Created Successfully');
        res.redirect(`/dashboard/singleRiceStock/${riceStockId}`);
        
    }catch(error){
        next(error);
    }
}