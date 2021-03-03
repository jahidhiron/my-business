// bagId, name

const {Schema, model} = require('mongoose');

const bagSchema = new Schema({
    bagId: {
        type: String,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 20
    }
}, {
    timestamps: true
});

const Bag = model('Stock', bagSchema);
module.exports = Bag;