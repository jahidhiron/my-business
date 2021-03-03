const {validationResult} = require('express-validator');
const errorFormatter = require('../utils/validationErrorFormatter');
const Flash = require('../utils/Flash');

const BagTrader = require('../models/BagTrader');
const BagStock = require('../models/BagStock');

exports.bagTraderGetController = async (req, res, next) => {
    let bagTrader = await BagTrader.find();

    res.render('pages/dashboard/bagTrader/bagTrader',{
        title: "Bag Trader | Barik Enterprise",
        bagTrader,
        flashMessage: Flash.getMessage(req),
        errors: {}
    });
}

exports.newBagTraderGetController = async (req, res, next) => {
    res.render('pages/dashboard/bagTrader/newBagTrader',{
        title: "New Bag Trader | Barik Enterprise",
        flashMessage: Flash.getMessage(req),
        errors: {}
    });
}

exports.newBagTraderPostController = async (req, res, next) => {
    let errors = validationResult(req).formatWith(errorFormatter);
    console.log(errors.mapped());

    if(!errors.isEmpty()){
        return res.render('pages/dashboard/bagTrader/newBagTrader', {
            title: "New Bag Trader | Barik Enterprise",
            flashMessage: Flash.getMessage(req),
            errors: errors.mapped()
        }); 
    }
    let {
        name,
        banglaName,
        phone,
        village,
        thana,
        district
    } = req.body;

    try{
        let bagTrader = new BagTrader({
            name,
            banglaName,
            phone,
            debit: 0,
            credit: 0,
            totalBagBuy: 0,
            totalBagBuyCost: 0,
            address: {
                village: village,
                thana: thana,
                district: district
            }
        });

        await bagTrader.save();

        req.flash('success', 'New Bag Trader Successfully');
        res.redirect('/dashboard/bagTrader');

    }catch(error){
        next(error);
    }
}

exports.singleBagTraderGetController = async (req, res, next) => {
    let bagTraderId = req.params.bagTraderId;
    let bagTrader = await BagTrader.findOne({_id:bagTraderId});

    try{
        res.render('pages/dashboard/bagTrader/singleBagTrader',{
            title: `${bagTrader.name} | Barik Enterprise`,
            bagTrader,
            flashMessage: Flash.getMessage(req),
            errors: {}
        });

    }catch(error){
        next(error);
    }
}

exports.newTransactionPostController = async (req, res, next) => {
    let bagTraderId = req.params.bagTraderId;
    let errors = validationResult(req).formatWith(errorFormatter);
    let bagTrader = await BagTrader.findOne({_id: bagTraderId});
    let date = new Date();

    let {
        name,
        quantity,
        price,
        debit
    } = req.body;

    if(!errors.isEmpty()){
        return res.render('pages/dashboard/bagTrader/singleBagTrader',{
            title: `${bagTrader.name} | Barik Enterprise`,
            bagTrader,
            flashMessage: Flash.getMessage(req),
            errors: errors.mapped()
        }); 
    }

    let bagStock = await BagStock.findOne({name: name});
    if(!bagStock){
        req.flash('fail', req.flash('fail', `${name.split(' ')[0] + ' ' + name.split(' ')[1]} Bag Stock doesn't Exist`));
        return res.redirect(`/dashboard/singleBagTrader/${bagTraderId}`);
        
    }
    

    quantity = parseInt(quantity);
    price = parseFloat(price);
    debit = parseInt(debit);
    let credit = quantity * price;
    
    try{
        let month = date.getMonth() + 1;
        let transactions = [
            {
                name,
                quantity,
                price,
                debit,
                credit,
                date: date.getDate() + '/' + month  + '/' + date.getFullYear()
            }
        ];

        await BagTrader.findOneAndUpdate(
            {_id: bagTraderId},
            {$push: {transactions}}
        );

        bagTrader = await BagTrader.findById(bagTraderId);

        let totalDebit = bagTrader.debit + debit;
        let totalCredit = bagTrader.credit + credit;

        if(totalDebit > totalCredit){
            totalDebit -= totalCredit;
            totalCredit = 0;
        }else{
            totalCredit -= totalDebit;
            totalDebit = 0;
        }

        let totalBagBuy = bagTrader.totalBagBuy + quantity;
        let totalBagBuyCost = bagTrader.totalBagBuyCost + credit;

        await BagTrader.findOneAndUpdate(
            {_id: bagTraderId},
            {$set: {
                debit: totalDebit, 
                credit: totalCredit, 
                totalBagBuy, 
                totalBagBuyCost
            }}
        );

        transactions = [
            {
                quantity,
                totalPrice: credit,
                date: date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear()
            }
        ];

        await BagStock.findOneAndUpdate(
            {_id: bagStock._id},
            {$push: {transactions}}
        );

        let totalQuantity = bagStock.totalQuantity + quantity;
        let netPrice = bagStock.netPrice + credit;
        let avgPrice = netPrice / totalQuantity;
        if(totalQuantity === 0){
            avgPrice = 0;
        }

        await BagStock.findOneAndUpdate(
            {_id: bagStock._id},
            {$set: {avgPrice, totalQuantity, netPrice}}
        );

        req.flash('success', 'New Transaction Created Successfully');
        res.redirect(`/dashboard/singleBagTrader/${bagTraderId}`);
        
    }catch(error){
        next(error);
    }
}
