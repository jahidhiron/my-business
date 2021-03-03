// bagTraderId, name, phone, address, debit, credit, totalBuyBag, totalBuyBagCost, transaction

const {Schema, model} = require('mongoose');

const bagTraderSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        min: 4,
        max: 30
    },
    banglaName: {
        type: String,
        required: true,
        trim: true,
        min: 4,
        max: 30
    },
    phone: {
        type: String,
        required: true,
        minlength: 9,
        maxlength: 15,
        trim: true
    },
    address: {
        village: String,
        thana: String,
        district: String
    },
    debit: Number,
    credit: Number,
    totalBagBuy: Number,
    totalBagBuyCost: Number,
    transactions: [
        {
            name: {
                type: String,
                required: true
            },
            quantity: Number,
            price: Number,
            debit: Number,
            credit: Number,
            date: String
        }
    ]
}, {
    timestamps: true
});

const BagTrader = model('BagTrader', bagTraderSchema);
module.exports = BagTrader;