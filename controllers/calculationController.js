const {validationResult} = require('express-validator');
const errorFormatter = require('../utils/validationErrorFormatter');
const Flash = require('../utils/Flash');

const Customer = require('../models/Customer');
const Cost = require('../models/Cost');
const OnCash = require('../models/OnCash');

function dateGenarate(dateStart, dateEnd){
    let startYear = parseInt(dateStart[0]);
    let startMonth = parseInt(dateStart[1]);
    let startDate = parseInt(dateStart[2]);

    let endYear= parseInt(dateEnd[0]);
    let endMonth = parseInt(dateEnd[1]);
    let endDate = parseInt(dateEnd[2]);

    let numberOfDate = (endYear - startYear) * 372 + (endMonth - startMonth) * 31 + (endDate - startDate) + 1;
    let allDate = [];

    for(let i = 0; i < numberOfDate; i++){
        allDate.push(startDate + '/' + startMonth + '/' + startYear);

        if(startDate > 30){
            startDate = 0;
            startMonth++;
        }
        if(startMonth > 12){
            startMonth = 1;
            startYear++;
        }
        startDate++;
    }

    return allDate;
}

exports.calculationGetController = async (req, res, next) => {
    res.render('pages/dashboard/calculation',{
        title: "Calculation | Barik Enterprise",
        totalProfit: undefined,
        totalDay: undefined,
        labourCost: undefined,
        transportCost: undefined,
        millCost: undefined,
        extraCost: undefined,
        allCost: undefined,
        flashMessage: Flash.getMessage(req),
        errors: {}
    });
}

exports.profitGetController = async (req, res, next) => {
    let customer = await Customer.find();
    const onCash = await OnCash.find();
    console.log(onCash);
    
    let {
        startDate,
        endDate
    } = req.query;

    let dateStart = startDate.split('-');
    let dateEnd = endDate.split('-');
    
    let allDate = dateGenarate(dateStart, dateEnd);

    let totalProfit = 0;
    for(let c of customer){
        for(let trans of c.transactions){
            for(let i = 0; i < allDate.length; i++){
                if(trans.date === allDate[i]){
                    totalProfit += trans.profit;
                }
            }
        }
    }

    for(let trans of onCash[0].transactions){
        for(let i = 0; i < allDate.length; i++){
            if(trans.date === allDate[i]){
                totalProfit += trans.profit;
            }
        }
    }

    res.render('pages/dashboard/calculation',{
        title: "Calculation | Barik Enterprise",
        totalProfit,
        totalDay: allDate.length,
        transportCost: undefined,
        labourCost: undefined,
        millCost: undefined,
        extraCost: undefined,
        allCost: undefined,
        flashMessage: Flash.getMessage(req),
        errors: {}
    });
}

exports.allCostGetController = async (req, res, next) => {
    let labour = await Cost.findOne({name: 'লেবার বাবদ'});
    let transport = await Cost.findOne({name: 'গাড়ি ভাড়া'});
    let mill = await Cost.findOne({name: 'মিল বাবদ'});
    let extra = await Cost.findOne({name: 'বিবিধ'});
    
    let {
        startDate,
        endDate
    } = req.query;

    let dateStart = startDate.split('-');
    let dateEnd = endDate.split('-');
    
    let allDate = dateGenarate(dateStart, dateEnd);

    let labourCost = 0;
    let transportCost = 0;
    let millCost = 0;
    let extraCost = 0;
    
    for(let trans of labour.transactions){
        for(let i = 0; i < allDate.length; i++){
            if(trans.date === allDate[i]){
                labourCost += trans.dailyCost;
            }
        }
    }

    for(let trans of transport.transactions){
        for(let i = 0; i < allDate.length; i++){
            if(trans.date === allDate[i]){
                transportCost += trans.dailyCost;
            }
        }
    }

    for(let trans of mill.transactions){
        for(let i = 0; i < allDate.length; i++){
            if(trans.date === allDate[i]){
                millCost += trans.dailyCost;
            }
        }
    }

    for(let trans of extra.transactions){
        for(let i = 0; i < allDate.length; i++){
            if(trans.date === allDate[i]){
                extraCost += trans.dailyCost;
            }
        }
    }

    let allCost = labourCost + transportCost + millCost + extraCost;
    console.log(allCost);

    res.render('pages/dashboard/calculation',{
        title: "Calculation | Barik Enterprise",
        allCost,
        totalProfit: undefined,
        extraCost: undefined,
        transportCost: undefined,
        millCost: undefined,
        labourCost: undefined,
        totalDay: allDate.length,
        flashMessage: Flash.getMessage(req),
        errors: {}
    });
}

exports.labourCostGetController = async (req, res, next) => {
    let labour = await Cost.findOne({name: 'লেবার বাবদ'});
    
    let {
        startDate,
        endDate
    } = req.query;

    let dateStart = startDate.split('-');
    let dateEnd = endDate.split('-');
    
    let allDate = dateGenarate(dateStart, dateEnd);

    let labourCost = 0;
    
    for(let trans of labour.transactions){
        for(let i = 0; i < allDate.length; i++){
            if(trans.date === allDate[i]){
                labourCost += trans.dailyCost;
            }
        }
    }

    res.render('pages/dashboard/calculation',{
        title: "Calculation | Barik Enterprise",
        totalProfit: undefined,
        extraCost: undefined,
        transportCost: undefined,
        millCost: undefined,
        allCost: undefined,
        labourCost,
        totalDay: allDate.length,
        flashMessage: Flash.getMessage(req),
        errors: {}
    });
}

exports.transportCostGetController = async (req, res, next) => {
    let transport = await Cost.findOne({name: 'গাড়ি ভাড়া'});
    
    let {
        startDate,
        endDate
    } = req.query;

    let dateStart = startDate.split('-');
    let dateEnd = endDate.split('-');
    
    let allDate = dateGenarate(dateStart, dateEnd);

    let transportCost = 0;
    
    for(let trans of transport.transactions){
        for(let i = 0; i < allDate.length; i++){
            if(trans.date === allDate[i]){
                transportCost += trans.dailyCost;
            }
        }
    }

    res.render('pages/dashboard/calculation',{
        title: "Calculation | Barik Enterprise",
        totalProfit: undefined,
        labourCost: undefined,
        millCost: undefined,
        extraCost: undefined,
        allCost: undefined,
        transportCost,
        totalDay: allDate.length,
        flashMessage: Flash.getMessage(req),
        errors: {}
    });
}

exports.millCostGetController = async (req, res, next) => {
    let mill = await Cost.findOne({name: 'মিল বাবদ'});
    
    let {
        startDate,
        endDate
    } = req.query;

    let dateStart = startDate.split('-');
    let dateEnd = endDate.split('-');
    
    let allDate = dateGenarate(dateStart, dateEnd);

    let millCost = 0;
    
    for(let trans of mill.transactions){
        for(let i = 0; i < allDate.length; i++){
            if(trans.date === allDate[i]){
                millCost += trans.dailyCost;
            }
        }
    }

    res.render('pages/dashboard/calculation',{
        title: "Calculation | Barik Enterprise",
        totalProfit: undefined,
        labourCost: undefined,
        transportCost: undefined,
        extraCost: undefined,
        allCost: undefined,
        millCost,
        totalDay: allDate.length,
        flashMessage: Flash.getMessage(req),
        errors: {}
    });
}

exports.extraGetController = async (req, res, next) => {
    let extra = await Cost.findOne({name: 'বিবিধ'});
    
    let {
        startDate,
        endDate
    } = req.query;

    let dateStart = startDate.split('-');
    let dateEnd = endDate.split('-');
    
    let allDate = dateGenarate(dateStart, dateEnd);

    let extraCost = 0;
    
    for(let trans of extra.transactions){
        for(let i = 0; i < allDate.length; i++){
            if(trans.date === allDate[i]){
                extraCost += trans.dailyCost;
            }
        }
    }

    res.render('pages/dashboard/calculation',{
        title: "Calculation | Barik Enterprise",
        totalProfit: undefined,
        labourCost: undefined,
        transportCost: undefined,
        millCost: undefined,
        allCost: undefined,
        extraCost,
        totalDay: allDate.length,
        flashMessage: Flash.getMessage(req),
        errors: {}
    });
}

