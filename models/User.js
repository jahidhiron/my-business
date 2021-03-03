 // userId, email, password, profilePics, Profile

const {Schema, model} = require('mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    profilePic: {
        type: String,
        default: '/uploads/default.png'
    },
    profile: {
        type: Schema.Types.ObjectId,
        ref: 'Profile'
    }
},{
    timestamps: true
});

const User = model('User', userSchema);
module.exports = User;