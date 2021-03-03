// bagType, name, quantity, avgPerBagPrice, netPrice, totalBagBuy, totalBagBuyCost, transactions

const {Schema, model} = require('mongoose');

const bagStockSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    avgPrice: Number,
    totalQuantity: Number,
    netPrice: Number,
    transactions: [
        {
            quantity: {
                type: String,
                required: true
            },
            totalPrice: Number,
            date: String
        }
    ]
}, {
    timestamps: true
});

const BagStock = model('BagStock', bagStockSchema);
module.exports = BagStock;