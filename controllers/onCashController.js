const {validationResult} = require('express-validator');
const errorFormatter = require('../utils/validationErrorFormatter');
const Flash = require('../utils/Flash');

const OnCash = require('../models/OnCash');
const RiceStock = require('../models/RiceStock');
const OtherStock = require('../models/OtherStock');

exports.onCashGetController = async (req, res, next) => {
    let onCash = await OnCash.find();
    const riceStock = await RiceStock.find();
    const otherStock = await OtherStock.find();
    
    if(!onCash[0]){
        onCash = new OnCash({
            totalSell: 0,
            totalBag: 0,
            totalProfit: 0,
            transactions: []    
        });
        onCash.save();
    }

    res.render('pages/dashboard/onCash/onCash',{
        title: "On Cash | Barik Enterprise",
        onCash: onCash[0],
        riceStock,
        otherStock,
        flashMessage: Flash.getMessage(req),
        errors: {}
    });
}

exports.newTransactionPostController = async (req, res, next) => {
    let errors = validationResult(req).formatWith(errorFormatter);
    let onCash = await OnCash.find();
    let riceStock = await RiceStock.find();
    let otherStock = await OtherStock.find();
    let date = new Date();

    let {
        name,
        quantity,
        price,
        weight
    } = req.body;

    if(!errors.isEmpty()){
        return res.render('pages/dashboard/onCash/onCash',{
            title: `On Cash | Barik Enterprise`,
            onCash: onCash[0],
            riceStock,
            otherStock,
            flashMessage: Flash.getMessage(req),
            errors: errors.mapped()
        }); 
    }

    if(name !== 'তোষ'){
        riceStock = await RiceStock.findOne({name});
        otherStock = await OtherStock.findOne({name});
    }

    if(riceStock){
        if(quantity > riceStock.totalQuantity){
            req.flash('fail', req.flash('fail', `Out of ${quantity} bags, only ${riceStock.totalQuantity} bags is available`));
            return res.redirect(`/dashboard/onCash`);
        }
    }
    if(otherStock){
        if(quantity > otherStock.totalQuantity){
            req.flash('fail', req.flash('fail', `Out of ${quantity} bags, only ${otherStock.totalQuantity} bags is available`));
            return res.redirect(`/dashboard/onCash`);
        }
    }
    
    quantity = parseInt(quantity);
    price = parseFloat(price);
    weight = parseFloat(weight);

    let profit = 0;
    
    if(riceStock){
        profit = (price - riceStock.avgPrice) * quantity;
    }
    if(otherStock){
        profit = (price - otherStock.avgPrice) * quantity;
    }
    
    try{
        let transactions = [];
        let cost = quantity * price;

        if(name !== 'তোষ'){
            let totalSell = onCash[0].totalSell + cost;
            let totalBag = onCash[0].totalBag + quantity;
            let totalProfit = onCash[0].totalProfit + profit;
            
            let month = date.getMonth() + 1;
            transactions = [
                {
                    name,
                    price,
                    quantity,
                    cost,
                    profit,
                    date: date.getDate() + '/' + month + '/' + date.getFullYear()
                }
            ];

            await OnCash.findOneAndUpdate(
                {_id: onCash[0]._id},
                {$push: {transactions}}
            );

            await OnCash.findOneAndUpdate(
                {_id: onCash[0]._id},
                {$set: {
                    totalSell, 
                    totalBag, 
                    totalProfit
                }}
            );
        }else{
            if(!weight){
                req.flash('fail', 'You have to provide weight if product is tosh');
                return res.redirect(`/dashboard/onCash`);
            }else{
                cost = weight * price;
                let totalSell = onCash[0].totalSell + cost;
                let totalBag = onCash[0].totalBag;
                let totalProfit = onCash[0].totalProfit + cost;
                cost = weight * price;
                let month = date.getMonth() + 1;
                transactions = [
                    {
                        name,
                        price,
                        quantity: 0,
                        cost,
                        profit: cost,
                        date: date.getDate() + '/' + month + '/' + date.getFullYear()
                    }
                ];
                
                await OnCash.findOneAndUpdate(
                    {_id: onCash[0]._id},
                    {$push: {transactions}}
                );

                await OnCash.findOneAndUpdate(
                    {_id: onCash[0]._id},
                    {$set: {
                        totalSell, 
                        totalBag, 
                        totalProfit
                    }}
                );
            }
        }

        if(name !== 'তোষ'){
            if(riceStock){
                let totalQuantity = riceStock.totalQuantity - quantity;
                let totalWeight = (parseInt(name.split(' ')[1]) * totalQuantity) / 40;
                let netPrice = riceStock.avgPrice * totalQuantity;
                let avgPrice = riceStock.avgPrice;
                if(totalQuantity === 0){
                    avgPrice = 0;
                }
    
                await RiceStock.findOneAndUpdate(
                    {_id: riceStock._id},
                    {$set: {
                        totalQuantity, 
                        totalWeight, 
                        netPrice,
                        avgPrice
                    }}
                );
            }
    
            if(otherStock){
                let totalQuantity = otherStock.totalQuantity - quantity;
                let totalWeight = (parseInt(name.split(' ')[1]) * totalQuantity) / 40;
                let netPrice = otherStock.avgPrice * totalQuantity;
                let avgPrice = otherStock.avgPrice;
                if(totalQuantity === 0){
                    avgPrice = 0;
                }

                await OtherStock.findOneAndUpdate(
                    {_id: otherStock._id},
                    {$set: {
                        totalQuantity, 
                        totalWeight, 
                        netPrice,
                        avgPrice
                    }}
                );
            }
        }

        req.flash('success', 'New Transaction Created Successfully');
        res.redirect(`/dashboard/onCash`);
        
    }catch(error){
        next(error);
    }
}