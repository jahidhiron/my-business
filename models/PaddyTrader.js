// traderId, name, phone, address, debit, credit, debitBag, creditBag, totalBagSold, totalPaddySold, totalAmountSold, transactions

const {Schema, model} = require('mongoose');

const paddyTraderSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 30,
        lowercase: true
    },
    banglaName: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 30,
        lowercase: true
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
    debit: {
        type: Number,
        trim: true
    },
    credit: {
        type: Number,
        trim: true
    },
    debitBag:{
        type: Number,
        trim: true
    },
    creditBag: {
        type: Number,
        trim: true
    },
    totalPaddySold: {
        type: Number,
        trim: true
    },
    totalBagSold: {
        type: Number,
        trim: true
    },
    totalAmountSold: {
        type: Number,
        trim: true
    },
    transactions: [
        {
            name: {
                type: String,
                required: true
            },
            banglaName: String,
            debitBag: Number,
            creditBag: Number,
            debit: Number,
            credit: Number,
            quantity: {
                type: Number,
                required: true,
                trim: true
            },
            weight: {
                type: Number,
                required: true,
                trim: true
            },
            price: {
                type: Number,
                required: true,
                trim: true
            },
            date: String      
        }
    ]
},{
    timestamps: true
});

const PaddyTrader = model('PaddyTrader', paddyTraderSchema);
module.exports = PaddyTrader;