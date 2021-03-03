// productId, name, avgPerPicPrise, totalQuantity, netPrise, transactions

const {Schema, model} = require('mongoose');

const riceStockSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    banglaName: {
        type: String,
        required: true
    },
    avgPrice: String,
    totalQuantity: Number,
    totalWeight: Number,
    netPrice: Number,
    
    transactions: [
        {
            quantity: Number,
            totalPrice: String,
            date: String
        }
    ]
}, {
    timestamps: true
});

const RiceStock = model('RiceStock', riceStockSchema);
module.exports = RiceStock;