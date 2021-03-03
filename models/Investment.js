// investorId, name, position, phone, address, transaction

const {Schema, model} = require('mongoose');

const investmentSchema = new Schema({
    investorId: {
        type: String,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 4,
        maxlength: 30
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        min: 9,
        max: 15
    },
    address: {
        villege: String,
        thana: String,
        district: String
    },
    position: {
        type: String,
        trim: true
    },
    totalInvestment: Number,
    transactions: [
        {
            transId: Sotring,
            transCount: Number,
            debit: Number,
            credit: Number,
            createAt: {
                type: Date,
                default: new Date()
            }
        }
    ]
});

const Investment = model('Investment', investmentSchema);
module.exports = Investment;