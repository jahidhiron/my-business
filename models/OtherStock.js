// productId, name, avgPerPicPrise, totalQuantity, netPrise, transactions

const {Schema, model} = require('mongoose');

const otherStockSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    avgPrice: Number,
    totalQuantity: Number,
    totalWeight: Number,
    netPrice: Number,
    
    transactions: [
        {
            quantity: Number,
            weight: Number,
            totalPrice: String,
            date: String
        }
    ]
}, {
    timestamps: true
});

const OtherStock = model('OtherStock', otherStockSchema);
module.exports = OtherStock;