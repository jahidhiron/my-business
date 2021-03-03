const {validationResult} = require('express-validator');
const errorFormatter = require('../utils/validationErrorFormatter');
const Flash = require('../utils/Flash');

const Customer = require('../models/Customer');
const RiceStock = require('../models/RiceStock');
const OtherStock = require('../models/OtherStock');
const Tagda = require('../models/Tagda');

exports.customerGetController = async (req, res, next) => {
    let customer = await Customer.find()

    res.render('pages/dashboard/customer/area',{
        title: "Customer | Barik Enterprise",
        customer,
        flashMessage: Flash.getMessage(req),
        errors: {}
    });
}

exports.customerByAreaGetController = async (req, res, next) => {
    let area = req.params.area;
    let customer = await Customer.find();
    console.log(area);

    res.render('pages/dashboard/customer/customer',{
        title: `${area} bazar | Barik Enterprise`,
        customer,
        area,
        flashMessage: Flash.getMessage(req),
        errors: {}
    });
}

exports.customerTagdaGetController = async (req, res, next) => {
    let area = req.params.area;
    let customer = await Customer.find()

    res.render('pages/dashboard/customer/tagda',{
        title: `${area} bazar | Barik Enterprise`,
        customer,
        area,
        flashMessage: Flash.getMessage(req),
        errors: {}
    });
}

exports.customerTagdaPostController = async (req, res, next) => {
    let area = req.params.area;
    let customer = await Customer.find().or([{area: area}]);
    let tagda = await Tagda.find();

    let {
        credit
    } = req.body

    if(!Array.isArray(credit)){
        credit = new Array(credit);
    }
    if(credit.length > 0){
        credit = credit.map(function(item) {
            if(!item){
                item = 0;
            }
            return parseInt(item, 10);
        });
    
        let totalCredit = 0;
        let transactions = [];
        let date = new Date();
        let i = 0;
        let totalcash = 0;
    
        try{
            for(let c of customer){
                if(credit[i]){
                    totalcash += credit[i];
                    totalDebit = c.debit
                    totalCredit = c.credit + credit[i];
        
                    if(totalDebit > totalCredit){
                        totalDebit -= totalCredit;
                        totalCredit = 0;
                    }else{
                        totalCredit -= totalDebit;
                        totalDebit = 0;
                    }
                    
                    let month = date.getMonth() + 1;
                    transactions = [
                        {
                            name: 'tagda',
                            price: 0,
                            quantity: 0,
                            debit: 0,
                            credit: credit[i],
                            profit: 0,
                            date: date.getDate() + '/' + month + '/' + date.getFullYear()
                        }
                    ];
        
                    await Customer.findOneAndUpdate(
                        {_id: c._id},
                        {$push: {transactions}}
                    );
        
                    await Customer.findOneAndUpdate(
                        {_id: c._id},
                        {$set: {
                            debit: totalDebit, 
                            credit: totalCredit
                        }}
                    );
                }
                i++;
            }

            tagda = await Tagda.find();
            if(!tagda[0]){
                let newTagda = new Tagda({
                    transactions: []
                });
                await newTagda.save();
                
                month = date.getMonth() + 1;
                transactions = [
                    {
                        area,
                        cash: totalcash,
                        date: date.getDate() + '/' + month + '/' + date.getFullYear()
                    }
                ];
    
                tagda = await Tagda.find();
                await Tagda.findOneAndUpdate(
                    {_id: tagda[0]._id},
                    {$push: {transactions}}
                );
            }else{
                month = date.getMonth() + 1;
                transactions = [
                    {
                        area,
                        cash: totalcash,
                        date: date.getDate() + '/' + month + '/' + date.getFullYear()
                    }
                ];
        
                tagda = await Tagda.find();
                await Tagda.findOneAndUpdate(
                    {_id: tagda[0]._id},
                    {$push: {transactions}}
                );
            }
    
        }catch(error){
            next(error);
        }
    }else{
        req.flash('fail', 'No one has given money');
        return res.render(`pages/dashboard/customer/customer`,{
            title: `${area} bazar | Barik Enterprise`,
            customer,
            area,
            flashMessage: Flash.getMessage(req),
            errors: {}
        });
    }

    customer = await Customer.find().or([{area: area}]);

    req.flash('success', 'Tagda is filled up Successfully');
    // res.redirect('/dashboard/customer/area')
    res.render('pages/dashboard/customer/area',{
        title: `${area} bazar | Barik Enterprise`,
        customer,
        area,
        flashMessage: Flash.getMessage(req),
        errors: {}
    });
}

exports.newCustomerGetController = async (req, res, next) => {
    let customer = await Customer.find();
    res.render('pages/dashboard/customer/newCustomer',{
        title: "New Customer | Barik Enterprise",
        customer,
        flashMessage: Flash.getMessage(req),
        errors: {}
    });
}

exports.newCustomerPostController = async (req, res, next) => {
    let errors = validationResult(req).formatWith(errorFormatter);
    let customer = await Customer.find();

    if(!errors.isEmpty()){
        return res.render('pages/dashboard/customer/newCustomer', {
            title: "Paddy Stock | Barik Enterprise",
            customer,
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
        district,
        area
    } = req.body;

    try{
        let customer = new Customer({
            name,
            banglaName,
            phone,
            debit: 0,
            credit: 0,
            totalBuy: 0,
            totalBag: 0,
            totalProfit: 0,
            address: {
                village: village,
                thana: thana,
                district: district
            },
            area,
            transactions: []
        });

        await customer.save();

        req.flash('success', 'New Customer Created Successfully');
        res.redirect('/dashboard/customer');

    }catch(error){
        next(error);
    }
}

exports.singleCustomerGetController = async (req, res, next) => {
    let customerId = req.params.customerId;
    let customer = await Customer.findOne({_id: customerId});
    let riceStock = await RiceStock.find();
    let otherStock = await OtherStock.find();
    console.log(riceStock);

    try{
        res.render('pages/dashboard/customer/singleCustomer',{
            title: `${customer.name} | Barik Enterprise`,
            customer,
            riceStock,
            otherStock,
            flashMessage: Flash.getMessage(req),
            errors: {}
        });

    }catch(error){
        next(error);
    }
}

exports.newTransactionPostController = async (req, res, next) => {
    let customerId = req.params.customerId;
    let errors = validationResult(req).formatWith(errorFormatter);
    let customer = await Customer.findOne({_id: customerId});
    let riceStock = await RiceStock.find();
    let otherStock = await OtherStock.find();
    let date = new Date();

    let {
        name,
        quantity,
        price,
        credit
    } = req.body;

    if(!errors.isEmpty()){
        return res.render('pages/dashboard/customer/singleCustomer',{
            title: `${customer.name} | Barik Enterprise`,
            customer,
            riceStock,
            otherStock,
            flashMessage: Flash.getMessage(req),
            errors: errors.mapped()
        }); 
    }

    riceStock = await RiceStock.findOne({name});
    otherStock = await OtherStock.findOne({name});

    if(riceStock){
        if(quantity > riceStock.totalQuantity){
            console.log('2')
            req.flash('fail', req.flash('fail', `Out of ${quantity} bags, only ${riceStock.totalQuantity} bags is available`));
            return res.redirect(`/dashboard/singleCustomer/${customerId}`);
        }
    }
    if(otherStock){
        if(quantity > otherStock.totalQuantity){
            console.log('4')
            req.flash('fail', req.flash('fail', `Out of ${quantity} bags, only ${otherStock.totalQuantity} bags is available`));
            return res.redirect(`/dashboard/singleCustomer/${customerId}`);
        }
    }
    
    quantity = parseInt(quantity);
    price = parseFloat(price);
    credit = parseFloat(credit);

    let debit = quantity * price;
    let profit = 0;
    
    if(riceStock){
        profit = (price - riceStock.avgPrice) * quantity;
    }
    if(otherStock){
        profit = (price - otherStock.avgPrice) * quantity;
    }
    
    try{
        let month = date.getMonth() + 1;
        let transactions = [
            {
                name,
                price,
                quantity,
                debit,
                credit,
                profit,
                date: date.getDate() + '/' + month + '/' + date.getFullYear()
            }
        ];

        await Customer.findOneAndUpdate(
            {_id: customerId},
            {$push: {transactions}}
        );

        
        let totalDebit = customer.debit + debit;
        let totalCredit = customer.credit + credit;

        if(totalDebit > totalCredit){
            totalDebit -= totalCredit;
            totalCredit = 0;
        }else{
            totalCredit -= totalDebit;
            totalDebit = 0;
        }
        let totalBag = customer.totalBag + quantity;
        let totalBuy = customer.totalBuy + debit;
        let totalProfit = customer.totalProfit + profit;

        await Customer.findOneAndUpdate(
            {_id: customerId},
            {$set: {
                debit: totalDebit, 
                credit: totalCredit, 
                totalBuy, 
                totalBag,
                totalProfit
            }}
        );

        if(riceStock){
            let totalQuantity = riceStock.totalQuantity - quantity;
            let totalWeight = (parseInt(name.split(' ')[1]) * totalQuantity) / 40;
            let netPrice = riceStock.avgPrice * totalQuantity;
            let avgPrice = riceStock.avgPrice
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
            let avgPrice = otherStock.avgPrice

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

        req.flash('success', 'New Transaction Created Successfully');
        res.redirect(`/dashboard/singleCustomer/${customerId}`);
        
    }catch(error){
        next(error);
    }
}