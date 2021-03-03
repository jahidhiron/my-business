// traderId, name, phone, address, debit, credit, debitBag, creditBag, totalBagSold, totalPaddySold, totalAmountSold, transactions

const {Schema, model} = require('mongoose');

const tagdaSchema = new Schema({
    transactions: [
        {
            area: {
                type: String,
                required: true,
                trim: true
            },
            cash: {
                type: Number,
                required: true
            },
            date: String
        }
    ]
},{
    timestamps: true
});

const Tagda = model('Tagda', tagdaSchema);
module.exports = Tagda;