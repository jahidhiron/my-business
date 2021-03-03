// summaryId, month, availableProduct, totalInvestment, totalProfit, transactions 

const {Schema, model} = require('mongoose');

const summarySchema = new Schema({
    summaryId: {
        type: String,
        required: true,
        trim: true
    },
    month: {
        type: Date,
        default: new Date()
    },
    availableProduct: [
        {
            type: Schema.Types.ObjectId,
            ref: 'ProductStock'
        }
    ],
    monthlyInvestment: Number,
    monthlySell: Number,
    monthlyProfit: Number,
    transactions: [
        {
            transId: String,
            transCount: Number,
            cost: {
                type: Schema.Types.ObjectId,
                ref: 'Cost'
            },
            customer: {
                type: Schema.Types.ObjectId,
                ref: 'Customer'
            },
            dailySell: Number,
            dailyProfit: Number
        }
    ]
});

const Summary = model('Summary', summarySchema);
module.exports = Summary;