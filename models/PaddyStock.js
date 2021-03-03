// productId, name, avgPerPicPrise, totalQuantity, netPrise, transactions

const {Schema, model} = require('mongoose');

const paddyStockSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    banglaName: String,
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    avgPrice: String,
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

const PaddyStock = model('PaddyStock', paddyStockSchema);
module.exports = PaddyStock;