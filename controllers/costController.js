const {validationResult} = require('express-validator');
const errorFormatter = require('../utils/validationErrorFormatter');
const Flash = require('../utils/Flash');

const Cost = require('../models/Cost');

exports.costGetController = async (req, res, next) => {
    let cost = await Cost.find()

    res.render('pages/dashboard/cost/cost',{
        title: "Cost | Barik Enterprise",
        cost,
        flashMessage: Flash.getMessage(req),
        errors: {}
    });
}

exports.newCostGetController = async (req, res, next) => {
    res.render('pages/dashboard/cost/newCost',{
        title: "New Cost | Barik Enterprise",
        flashMessage: Flash.getMessage(req),
        errors: {}
    });
}

exports.newCostPostController = async (req, res, next) => {
    let errors = validationResult(req).formatWith(errorFormatter);

    if(!errors.isEmpty()){
        return res.render('pages/dashboard/cost/newCost', {
            title: "New Cost | Barik Enterprise",
            flashMessage: Flash.getMessage(req),
            errors: errors.mapped()
        }); 
    }
    let {
        name
    } = req.body;

    try{
        let cost = new Cost({
            name,
            totalCost: 0,
            transactions: []
        });

        await cost.save();

        req.flash('success', 'New Cost created Successfully');
        res.redirect('/dashboard/cost');

    }catch(error){
        next(error);
    }
}

exports.singleCostrGetController = async (req, res, next) => {
    let costId = req.params.costId;
    let cost = await Cost.findOne({_id: costId});
    console.log(cost);
    console.log(costId);

    try{
        res.render('pages/dashboard/cost/singleCost',{
            title: `${cost.name} | Barik Enterprise`,
            cost,
            flashMessage: Flash.getMessage(req),
            errors: {}
        });

    }catch(error){
        next(error);
    }
}

exports.newTransactionPostController = async (req, res, next) => {
    let costId = req.params.costId;
    let errors = validationResult(req).formatWith(errorFormatter);
    let cost = await Cost.findOne({_id: costId});
    let date = new Date();

    let {
        dailyCost
    } = req.body;

    if(!errors.isEmpty()){
        return res.render('pages/dashboard/cost/singleCost',{
            title: `${cost.name} | Barik Enterprise`,
            cost,
            flashMessage: Flash.getMessage(req),
            errors: errors.mapped()
        }); 
    }

    dailyCost = parseInt(dailyCost);
    
    try{
        let month = date.getMonth() + 1;
        let transactions = [
            {
                dailyCost,
                date: date.getDate() + '/' + month + '/' + date.getFullYear()
            }
        ];

        await Cost.findOneAndUpdate(
            {_id: costId},
            {$push: {transactions}}
        );

        let totalCost = cost.totalCost + dailyCost;

        await Cost.findOneAndUpdate(
            {_id: costId},
            {$set: {
                totalCost
            }}
        );

        req.flash('success', 'New Transaction Created Successfully');
        res.redirect(`/dashboard/singleCost/${costId}`);
        
    }catch(error){
        next(error);
    }
}