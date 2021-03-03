const {validationResult} = require('express-validator');
const errorFormatter = require('../utils/validationErrorFormatter');
const Flash = require('../utils/Flash');

const BagStock = require('../models/BagStock');

exports.bagStockGetController = async (req, res, next) => {
    let bagStock = await BagStock.find();
    
    res.render('pages/dashboard/bagStock/bagStock',{
        title: "Bag Stock | Barik Enterprise",
        bagStock,
        flashMessage: Flash.getMessage(req)
    });
}

exports.newBagStockGetController = async (req, res, next) => {
    res.render('pages/dashboard/bagStock/newBagStock',{
        title: "Bag Stock | Barik Enterprise",
        flashMessage: Flash.getMessage(req),
        errors: {}
    });
}

exports.newBagStockPostController = async (req, res, next) => {
    let errors = validationResult(req).formatWith(errorFormatter);

    if(!errors.isEmpty()){
        return res.render('pages/dashboard/bagStock/newBagStock', {
            title: "Bag Stock | Barik Enterprise",
            flashMessage: Flash.getMessage(req),
            errors: errors.mapped()
        }); 
    }

    let {
        name
    } = req.body;

    try{
        // let singleProduct = await Product.findOne({name: name});
        let newBagStock = await BagStock.findOne({name});
        
        if(newBagStock){
            req.flash('fail', `Stock of ${name.charAt(0).toUpperCase() + name.slice(1)} Already Exist`);
            return res.render('pages/dashboard/bagStock/newBagStock', {
                title: "Bag Stock | Barik Enterprise",
                flashMessage: Flash.getMessage(req),
                errors: errors.mapped()
            }); 
        } 
        let bagStock = new BagStock({
            name,
            avgPrice: 0,
            totalQuantity: 0,
            netPrice: 0,
            transactions: []
        });

        await bagStock.save();

        req.flash('success', 'New Bag Stock Created Successfully');
        res.redirect('/dashboard/bagStock');

    }catch(error){
        next(error);
    }
}

exports.singleBagStockGetController = async (req, res, next) => {
    let bagStockId = req.params.bagStockId;
    let bagStock = await BagStock.findOne({_id: bagStockId});
    console.log(bagStock)

    try{
        res.render('pages/dashboard/bagStock/singleBagStock',{
            title: `${bagStock.name} | Barik Enterprise`,
            bagStock,
            flashMessage: Flash.getMessage(req),
            errors: {}
        });

    }catch(error){
        next(error);
    }
}

