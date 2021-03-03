const {validationResult} = require('express-validator');
const errorFormatter = require('../utils/validationErrorFormatter');
const Flash = require('../utils/Flash');

const Customer = require('../models/Customer');
const PaddyTrder = require('../models/PaddyTrader');
const BagTrader = require('../models/BagTrader');
const Staff = require('../models/Staff');
const Labour = require('../models/Labour');
const Tagda = require('../models/Tagda');

exports.searchController = async (req, res, next) => {
    let {
        query
    } = req.query;

    let customer = await Customer.find().or([{name: query}, {phone: query}, {area: query}, {village: query}]);
    let paddyTrader = await PaddyTrder.find().or([{name: query}, {phone: query}, {village: query}]);
    let bagTrader = await BagTrader.find().or([{name: query}, {phone: query}, {village: query}]);
    let staff = await Staff.find().or([{name: query}, {phone: query}, {village: query}]);
    let labour = await Labour.find().or([{name: query}, {phone: query}, {village: query}]);
    let tagda = await Tagda.find().or([{area: query}]);

    let searchResult = false;
    if(customer.length > 0 || paddyTrader.length > 0 || bagTrader.length > 0 || staff.length > 0 || labour.length > 0){
        searchResult = true;
    }

    res.render('pages/dashboard/search',{
        title: "Search | Barik Enterprise",
        customer,
        paddyTrader,
        bagTrader,
        staff,
        labour,
        tagda,
        searchResult,
        flashMessage: Flash.getMessage(req),
        errors: {}
    });
}