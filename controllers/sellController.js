const {validationResult} = require('express-validator');
const errorFormatter = require('../utils/validationErrorFormatter');
const Flash = require('../utils/Flash');

const Customer = require('../models/Customer');

exports.sellGetController = async (req, res, next) => {
    let customer = await Customer.find();

    res.render('pages/dashboard/sell',{
        title: "Sell | Barik Enterprise",
        customer,
        flashMessage: Flash.getMessage(req),
        errors: {}
    });
}

exports.sellPostController = async (req, res, next) => {
    let errors = validationResult(req).formatWith(errorFormatter);
    let customer = await Customer.find();
    let date = new Date();

    if(!errors.isEmpty()){
        return res.render('pages/dashboard/sell', {
            title: "Sell | Barik Enterprise",
            customer,
            flashMessage: Flash.getMessage(req),
            errors: errors.mapped()
        }); 
    }

    let {
        name,
        debit,
        profit
    } = req.body;

    debit = parseInt(debit);
    if(!profit){
        profit = 0
    }else{
        profit = parseInt(profit);
    }

    try{
        customer = await Customer.findOne({name});

        let month = date.getMonth() + 1;
        let transactions = [
            {
                name: 'unknown',
                price: 0,
                quantity: 0,
                debit,
                credit: 0,
                profit,
                date: date.getDate() + '/' + month + '/' + date.getFullYear()
            }
        ];

        await Customer.findOneAndUpdate(
            {_id: customer._id},
            {$push: {transactions}}
        );
        
        let totalBuy = customer.totalBuy  + debit;
        let totalProfit = customer.totalProfit + profit;
        debit = customer.debit + debit;
        await Customer.findOneAndUpdate(
            {_id: customer._id},
            {$set: {
                totalBuy,
                totalProfit,
                debit,
            }}
        );

    }catch(error){
        next(error)
    }

    customer = await Customer.find();

    req.flash('success', 'Sell added Successfully');
    res.redirect(`/dashboard/sell`);
}