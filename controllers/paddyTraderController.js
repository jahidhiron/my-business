const {validationResult} = require('express-validator');
const errorFormatter = require('../utils/validationErrorFormatter');
const Flash = require('../utils/Flash');

const PaddyTrader = require('../models/PaddyTrader');
const Product = require('../models/Product');
const PaddyStock = require('../models/PaddyStock');
const BagStock = require('../models/BagStock');

exports.paddyTraderGetController = async (req, res, next) => {
    let paddyTrader = await PaddyTrader.find();

    res.render('pages/dashboard/paddyTrader/paddyTrader',{
        title: "Paddy Trader | Barik Enterprise",
        paddyTrader,
        flashMessage: Flash.getMessage(req),
        errors: {}
    });
}

// new paddy trader
exports.newPaddyTraderGetController = async (req, res, next) => {
    res.render('pages/dashboard/paddyTrader/newPaddyTrader',{
        title: "New Paddy Trader | Barik Enterprise",
        flashMessage: Flash.getMessage(req),
        errors: {}
    });
}

exports.newPaddyTraderPostController = async (req, res, next) => {
    let errors = validationResult(req).formatWith(errorFormatter);

    if(!errors.isEmpty()){
        return res.render('pages/dashboard/paddyTrader/newPaddyTrader', {
            title: "New Paddy Trader | Barik Enterprise",
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
        let paddyTrader = new PaddyTrader({
            name,
            banglaName,
            phone,
            debit: 0,
            credit: 0,
            debitBag: 0,
            creditBag: 0,
            totalPaddySold: 0,
            totalBagSold: 0,
            totalAmountSold: 0,
            address: {
                village: village || '',
                thana: thana || '',
                district: district || ''
            }
        });

        await paddyTrader.save();

        req.flash('success', 'New Paddy Trader Successfully');
        res.redirect('/dashboard/paddyTrader');

    }catch(error){
        next(error);
    }
}

// single paddy trader
exports.singlePaddyTraderGetController = async (req, res, next) => {
    let paddyTraderId = req.params.paddyTraderId;
    let paddyTrader = await PaddyTrader.findOne({_id: paddyTraderId});
    let product = await Product.find();

    try{
        res.render('pages/dashboard/paddyTrader/singlePaddyTrader',{
            title: `${paddyTrader.name} | Barik Enterprise`,
            paddyTrader,
            product,
            flashMessage: Flash.getMessage(req),
            errors: {}
        });

    }catch(error){
        next(error);
    }
}

exports.newTransactionPostController = async (req, res, next) => {
    let paddyTraderId = req.params.paddyTraderId;
    let errors = validationResult(req).formatWith(errorFormatter);
    let paddyTrader = await PaddyTrader.findOne({_id: paddyTraderId});
    let product = await Product.find();
    let date = new Date();

    let {
        name,
        debitBag,
        debit,
        quantity,
        weight,
        price
    } = req.body;

    if(!errors.isEmpty()){
        return res.render('pages/dashboard/paddyTrader/singlePaddyTrader',{
            title: `${paddyTrader.name} | Barik Enterprise`,
            paddyTrader,
            product,
            flashMessage: Flash.getMessage(req),
            errors: errors.mapped()
        }); 
    }

    let paddyStock = await PaddyStock.findOne({name: name});
    console.log(paddyStock);
    if(!paddyStock){
        req.flash('fail', req.flash('fail', `Paddy Stock don't Exist`));
        return res.redirect(`/dashboard/singlePaddyTrader/${paddyTraderId}`);
        
    }
    

    debitBag = parseInt(debitBag);
    debit = parseInt(debit);
    quantity = parseInt(quantity);
    weight = parseFloat(weight);
    price = parseFloat(price);
    let credit = parseInt(price * weight);
    
    try{
        let product = await Product.findOne({name});
        let month = date.getMonth();
        let transactions = [
            {
                name,
                banglaName: product.banglaName,
                debitBag,
                creditBag: quantity,
                debit,
                credit,
                quantity,
                weight,
                price,
                date: date.getDate() + '/' + month + '/' + date.getFullYear()
            }
        ];

        await PaddyTrader.findOneAndUpdate(
            {_id: paddyTraderId},
            {$push: {transactions}}
        );

        paddyTrader = await PaddyTrader.findById(paddyTraderId);

        let totalDebit = paddyTrader.debit + debit;
        let totalCredit = paddyTrader.credit + credit;

        if(totalDebit > totalCredit){
            totalDebit -= totalCredit;
            totalCredit = 0;
        }else{
            totalCredit -= totalDebit;
            totalDebit = 0;
        }

        let totalDebitBag = paddyTrader.debitBag + debitBag;
        let totalCreditBag = paddyTrader.creditBag + quantity;

        if(totalDebitBag > totalCreditBag){
            totalDebitBag -= totalCreditBag;
            totalCreditBag = 0;
        }else{
            totalCreditBag -= totalDebitBag;
            totalDebitBag = 0;
        }
        let totalBagSold = paddyTrader.totalBagSold + quantity;
        let totalAmountSold = paddyTrader.totalAmountSold + credit
        let totalPaddySold = paddyTrader.totalPaddySold + weight;

        await PaddyTrader.findOneAndUpdate(
            {_id: paddyTraderId},
            {$set: {
                debit: totalDebit, 
                credit: totalCredit, 
                debitBag: totalDebitBag, 
                creditBag: totalCreditBag,
                totalPaddySold,
                totalBagSold,
                totalAmountSold
            }}
        );

        month = date.getMonth();
        transactions = [
            {
                prise: price,
                quantity,
                weight,
                totalPrice: credit,
                date: date.getDate() + '/' + month + '/' + date.getFullYear()
            }
        ];

        let totalQuantity = paddyStock.totalQuantity + quantity;
        let totalWeight = paddyStock.totalWeight + weight;
        let netPrice = paddyStock.netPrice + credit;
        let avgPrice = netPrice / totalWeight;

        await PaddyStock.findOneAndUpdate(
            {_id: paddyStock._id},
            {$set: {totalQuantity, totalWeight, netPrice, avgPrice}}
        );

        let bagStock = await BagStock.findOne({name: '80 kg bag'});
        avgPrice = bagStock.avgPrice;
        totalQuantity = bagStock.totalQuantity + quantity - debitBag;
        netPrice = bagStock.netPrice;
        netPrice = avgPrice * totalQuantity;

        await BagStock.findOneAndUpdate(
            {_id: bagStock._id},
            {$set: {totalQuantity, netPrice, avgPrice}},
        );

        req.flash('success', 'New Transaction Created Successfully');
        res.redirect(`/dashboard/singlePaddyTrader/${paddyTraderId}`);
        
    }catch(error){
        next(error);
    }
}