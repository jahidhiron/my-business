// customerId, name, phone, address, debit, credit, area, transactions

const {Schema, model} = require('mongoose');

const customerSchema = new Schema({
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
    debit: Number,
    credit: Number,
    totalBuy: Number,
    totalBag: Number,
    totalProfit: Number,
    area: {
        type: String,
        required: true,
        trim: true
    },
    transactions: [
        {
            name: {
                type: String,
                required: true,
                trim: true
            },
            price: Number,
            quantity: Number,
            debit: Number,
            credit: Number,
            profit: Number,
            date: String    
        }
    ]
}, {
    timestamps: true
});

const Customer = model('Customer', customerSchema);
module.exports = Customer;