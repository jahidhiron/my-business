// staffId, name, phone, address, debit, credit, salary, transactions

const {Schema, model} = require('mongoose');

const staffSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 4,
        maxlength: 50,
        lowercase: true
    },
    banglaName: {
        type: String,
        required: true,
        trim: true,
        minlength: 4,
        maxlength: 50,
        lowercase: true
    },
    phone: {
        type: String,
        required: true,
        min: 9,
        max: 15,
        trim: true
    },
    address: {
        village: String,
        thana: String,
        district: String
    },
    debit: {
        type: Number,
        trim: true
    },
    credit: {
        type: Number,
        trim: true
    },
    salary: {
        type: Number,
        required: true,
        trim: true
    },
    image: String,
    transactions: [
        {
            transId: String,
            transCount: Number,
            debit: Number,
            credit: Number,
            time: String      
        }
    ]
}, {
    timestamps: true
});

const Staff = model('Staff', staffSchema);
module.exports = Staff;