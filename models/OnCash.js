// customerId, name, phone, address, debit, credit, area, transactions

const {Schema, model} = require('mongoose');

const onCashSchema = new Schema({
    totalSell: Number,
    totalBag: Number,
    totalProfit: Number,
    transactions: [
        {
            name: {
                type: String,
                required: true,
                trim: true
            },
            price: Number,
            quantity: Number,
            weight: Number,
            cost: Number,
            profit: Number,
            date: String    
        }
    ]
}, {
    timestamps: true
});

const OnCash = model('OnCash', onCashSchema);
module.exports = OnCash;