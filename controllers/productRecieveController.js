const {validationResult} = require('express-validator');
const errorFormatter = require('../utils/validationErrorFormatter');
const Flash = require('../utils/Flash');

const Customer = require('../models/Customer');
const RiceStock = require('../models/RiceStock');
const OtherStock = require('../models/OtherStock');

exports.productRecieveGetController = async (req, res, next) => {
    let customer = await Customer.find();
    let riceStock = await RiceStock.find();
    let otherStock = await OtherStock.find();

    res.render('pages/dashboard/productRecieve',{
        title: "Product Recieve | Barik Enterprise",
        customer,
        riceStock,
        otherStock,
        flashMessage: Flash.getMessage(req),
        errors: {}
    });
}

exports.productRecievePostController = async (req, res, next) => {
    let errors = validationResult(req).formatWith(errorFormatter);
    let customer = await Customer.find();
    let riceStock = await RiceStock.find();
    let otherStock = await OtherStock.find();
    console.log(errors.mapped())

    if(!errors.isEmpty()){
        return res.render('pages/dashboard/productRecieve', {
            title: "Product Recieve | Barik Enterprise",
            customer,
            riceStock,
            otherStock,
            flashMessage: Flash.getMessage(req),
            errors: errors.mapped()
        }); 
    }

    let {
        customerName,
        productName,
        quantity,
        price
    } = req.body;

    customer = await Customer.findOne({name: customerName});
    riceStock = await RiceStock.findOne({name: productName});
    otherStock = await OtherStock.findOne({name: productName});

    try{
        // let customer = new Customer({
        //     name,
        //     phone,
        //     debit: 0,
        //     credit: 0,
        //     totalBuy: 0,
        //     totalBag: 0,
        //     totalProfit: 0,
        //     address: {
        //         village: village,
        //         thana: thana,
        //         district: district
        //     },
        //     area,
        //     transactions: []
        // });

        // await customer.save();

        req.flash('success', 'Product recieve Successfully');
        res.redirect('/dashboard/productRecieve');

    }catch(error){
        next(error);
    }
}