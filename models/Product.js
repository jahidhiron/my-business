// productId, name, weightDescription

const {Schema, model} = require('mongoose');

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        maxlength: 20,
    },
    banglaName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        maxlength: 20,
    },
    type: {
        type: String,
        required: true
    },
    date: String
}, {
    timestamps: true
});

const Product = model('Product', productSchema);
module.exports = Product;