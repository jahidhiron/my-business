const {validationResult} = require('express-validator');
const errorFormatter = require('../utils/validationErrorFormatter');
const Flash = require('../utils/Flash');

const BagStock = require('../models/BagStock');
const BagTrader = require('../models/BagTrader');
const Customer = require('../models/Customer');
const Labour = require('../models/Labour');
const OtherStock = require('../models/OtherStock');
const PaddyStock = require('../models/PaddyStock');
const PaddyTrader = require('../models/PaddyTrader');
const RiceStock = require('../models/RiceStock');
const Staff = require('../models/Staff');

exports.customerGetController = async (req, res, next) => {
    let customer = await Customer.find()

    res.render('pages/dashboard/customer/area',{
        title: "Customer | Barik Enterprise",
        customer,
        flashMessage: Flash.getMessage(req),
        errors: {}
    });
}