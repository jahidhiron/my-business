// labourId, name, phone, address, debit, credit, transactions - [transId, transCount, debit, credit]

const {Schema, model} = require('mongoose');

const labourSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 4,
        maxlength: 30,
        lowercase: true
    },
    banglaName: {
        type: String,
        required: true,
        trim: true,
        minlength: 4,
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
    transactions: [
        {
            transId: String,
            transCount: Number,
            debit: Number,
            credit: Number,
            time: String      
        }
    ]
},{
    timestamps: true
});

const Labour = model('Labour', labourSchema);
module.exports = Labour;