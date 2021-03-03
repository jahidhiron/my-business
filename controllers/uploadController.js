const fs = require('fs');
const User = require('../models/User');
const Profile = require('../models/Profile');

exports.uploadProfilePic = async (req, res, next) => {
    if(req.file){
        try{
            let oldProfilePic = req.user.profilePic;
            let profile = await Profile.findOne({user: req.user._id});
            let profilePic = `/uploads/${req.file.filename}`;

            if(profile){
                await Profile.findOneAndUpdate(
                    {user: req.user._id},
                    {$set: {profilePic}}
                ); 
            }

            await User.findOneAndUpdate(
                {_id: req.user._id},
                {$set: {profilePic}}
            );

            if(oldProfilePic !== '/uploads/default.png'){
                fs.unlink(`public${oldProfilePic}`, error => {
                    console.log(error);
                });
            }

            res.status(200).json({
                profilePic
            });

        }catch(error){
            res.status(500).json({
                profilePic: req.user.profilePic
            });
        }
    }else{
        res.status(500).json({
            profilePic: req.user.profilePic
        });
    }
}

exports.removeProfilePic = (req, res, next) => {
    try{
        let defaultProfilePic = `/uploads/default.png`;
        let currentProfilePic = req.user.profilePic;

        fs.unlink(`public${currentProfilePic}`, async (error)=> {
            let profile = await Profile.findOne({user: req.user._id});
            if(profile){
                await profile.findOneAndUpdate(
                    {user: req.user._id},
                    {$set: {profilePic: defaultProfilePic}}
                );
            }
    
            await User.findOneAndUpdate(
                {_id: req.user._id},
                {$set: {profilePic: defaultProfilePic}}
            );

            res.status(200).json({
                profilePic: defaultProfilePic
            });
        });

    }catch(error){
        console.log(error)
        res.status(500).json({
            message: "Can't be remove Profile Picture"
        });
    }
}