// userId, name, phone, bio, profilePics, links - [facebook, twitter, instagram, linkedin, github]

const {Schema, model} = require('mongoose');

const profileSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 4,
        maxlength: 50
    },
    phone: {
        type: String,
        required: true,
        max: 15,
        trim: true
    },
    bio: {
        type: String,
        trim: true,
        maxlength: 500
    },
    profilePic: String,
    links: {
        website: String,
        facebook: String,
        linkedin: String,
        instagram: String,
        twitter: String,
        github: String
    }
},{
    timestamps: true
});

const Profile = model('Profile', profileSchema);
module.exports = Profile;