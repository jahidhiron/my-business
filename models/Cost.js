//  month, monthlyCost, transactions - {transId, transCount, labourCost, transportCost, electricity, paddyCost, extraCost}

const {Schema, model} = require('mongoose');

const costSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    totalCost: Number,
    transactions: [
        {
            date: String,
            dailyCost: Number 
        }
    ]
});

const Cost = model('Cost', costSchema);
module.exports = Cost;