const {validationResult} = require('express-validator');
const Flash = require('../utils/Flash');
const Profile = require('../models/Profile');
const errorFormatter = require('../utils/validationErrorFormatter');
const User = require('../models/User');

const BagStock = require('../models/BagStock');
const BagTrader = require('../models/BagTrader');
const Customer = require('../models/Customer');
const Labour = require('../models/Labour');
const OtherStock = require('../models/OtherStock');
const PaddyStock = require('../models/PaddyStock');
const PaddyTrader = require('../models/PaddyTrader');
const RiceStock = require('../models/RiceStock');
const Staff = require('../models/Staff');
const OnCash = require('../models/OnCash');

function getUnique(array){
    var uniqueArray = [];
    let data = 0;
    // Loop through array values
    for(i=0; i < array.length; i++){
        if(uniqueArray.indexOf(array[i]) === -1) {
            uniqueArray.push(array[i]);
        }
    }
    return uniqueArray;
}

exports.dashboardGetController = async (req, res, next) => {
    try{
        let profile = await Profile.findOne({userId: req.user._id});
        if(profile){
            let bagStock = await BagStock.find(); // ok
            let bagTrader = await BagTrader.find();
            let customer = await Customer.find(); // ok
            let labour = await Labour.find(); // ok
            const otherStock = await OtherStock.find(); // ok
            const paddyStock = await PaddyStock.find(); // ok
            const paddyTrader = await PaddyTrader.find();
            const riceStock = await RiceStock.find(); // ok
            const staff = await Staff.find(); // ok

            let totalPriceOfAllProduct = 0;
            for(let p of bagStock){
                totalPriceOfAllProduct += p.netPrice;
            }

            for(let o of otherStock){
                totalPriceOfAllProduct += o.netPrice;
            }

            for(let p of paddyStock){
                totalPriceOfAllProduct += p.netPrice;
            }

            for(let r of riceStock){
                totalPriceOfAllProduct += r.netPrice;
            }

            let guthailCustomerDue = 0;
            for(let c of customer){
                if(c.area === 'guthail'){
                    guthailCustomerDue += c.debit;
                }
            }

            let islampurCustomerDue = 0;
            for(let c of customer){
                if(c.area === 'islampur'){
                    islampurCustomerDue += c.debit;
                }
            }

            let dharmakuraCustomerDue = 0;
            for(let c of customer){
                if(c.area === 'dharmakura'){
                    dharmakuraCustomerDue += c.debit;
                }
            }

            let mukhsimolaCustomerDue = 0;
            for(let c of customer){
                if(c.area === 'mukhsimola'){
                    mukhsimolaCustomerDue += c.debit;
                }
            }

            let molomgongCustomerDue = 0;
            for(let c of customer){
                if(c.area === 'molomgong'){
                    molomgongCustomerDue += c.debit;
                }
            }

            let milbazarCustomerDue = 0;
            for(let c of customer){
                if(c.area === 'milbazar'){
                    milbazarCustomerDue += c.debit;
                }
            }

            let beltoliCustomerDue = 0;
            for(let c of customer){
                if(c.area === 'beltoli'){
                    beltoliCustomerDue += c.debit;
                }
            }

            let dewngongCustomerDue = 0;
            for(let c of customer){
                if(c.area === 'dewngong'){
                    dewngongCustomerDue += c.debit;
                }
            }

            let digolkandiCustomerDue = 0;
            for(let c of customer){
                if(c.area === 'digolkandi'){
                    digolkandiCustomerDue += c.debit;
                }
            }

            let mosarofgongCustomerDue = 0;
            for(let c of customer){
                if(c.area === 'mosarofgong'){
                    mosarofgongCustomerDue += c.debit;
                }
            }

            let jaroltolaCustomerDue = 0;
            for(let c of customer){
                if(c.area === 'jaroltola'){
                    jaroltolaCustomerDue += c.debit;
                }
            }

            let amtolaCustomerDue = 0;
            for(let c of customer){
                if(c.area === 'amtola'){
                    amtolaCustomerDue += c.debit;
                }
            }

            let pochaboholaCustomerDue = 0;
            for(let c of customer){
                if(c.area === 'pochabohola'){
                    pochaboholaCustomerDue += c.debit;
                }
            }

            let melandohoCustomerDue = 0;
            for(let c of customer){
                if(c.area === 'melandoho'){
                    melandohoCustomerDue += c.debit;
                }
            }

            let allDue = islampurCustomerDue + dharmakuraCustomerDue + mukhsimolaCustomerDue
            + molomgongCustomerDue + milbazarCustomerDue + beltoliCustomerDue + dewngongCustomerDue +
            digolkandiCustomerDue + mosarofgongCustomerDue + guthailCustomerDue + jaroltolaCustomerDue +
            amtolaCustomerDue + pochaboholaCustomerDue + melandohoCustomerDue;

            let paddyQuantity = 0;
            let paddyWeight = 0;
            let paddyPrice = 0;
            for(let p of paddyStock){
                paddyQuantity += p.totalQuantity;
                paddyWeight += p.totalWeight;
                paddyPrice += p.netPrice;
            }

            let rice25Quantity = 0;
            let rice50Quantity = 0;
            let riceTotalQuantity = 0;
            let riceTotalPrice = 0;
            let name = '';

            for(let r of riceStock){
                name = r.name.split(' ')[1];
                if(name == 25){
                    rice25Quantity += r.totalQuantity;
                }

                if(name == 50){
                    rice50Quantity += r.totalQuantity;
                }

                riceTotalQuantity += r.totalQuantity;
                riceTotalPrice += r.netPrice;
            }

            let advancedMoney = 0;
            for(let l of labour){
                advancedMoney += l.debit;
            }
            for(let s of staff){
                advancedMoney += s.debit;
            }

            let buyingDue = 0;
            for(let p of paddyTrader){
                buyingDue += p.credit;
            }
            for(let b of bagTrader){
                buyingDue += b.credit;
            }
            
            let totalInvest = totalPriceOfAllProduct  + advancedMoney + buyingDue + allDue;

            let date = [];
            for(let c of customer){
                for(let trans of c.transactions){
                    date.push(trans.date);
                }
            }
            
            let onCash = await OnCash.find()
            for(let trans of onCash[0].transactions){
                date.push(trans.date);
            }

            date = getUnique(date);
            let noOfDate = date.length;
            let sell = [];
            let sellByDate = [];

            for(let i = 0; i < noOfDate; i++){
                sell[i] = 0;
                for(let c of customer){
                    for(let trans of c.transactions){
                        if(trans.debit > 0){
                            if(date[i]===trans.date){
                                sell[i] += trans.quantity;
                            }
                        }
                    }
                }

                for(let trans of onCash[0].transactions){
                    if(date[i]===trans.date){
                        sell[i] += trans.quantity;
                    }
                }


                sellByDate.push([date[i].split('/')[0]+ '/' + date[i].split('/')[1], sell[i]]); 
            }

            sellByDate.unshift(['Date', 'Sell'])


            return res.render('pages/dashboard/dashboard', {
                totalPriceOfAllProduct,
                islampurCustomerDue,
                dharmakuraCustomerDue,
                mukhsimolaCustomerDue,
                molomgongCustomerDue,
                milbazarCustomerDue,
                beltoliCustomerDue,
                dewngongCustomerDue,
                digolkandiCustomerDue,
                mosarofgongCustomerDue,
                guthailCustomerDue,
                jaroltolaCustomerDue,
                amtolaCustomerDue,
                pochaboholaCustomerDue,
                melandohoCustomerDue,
                allDue,
                paddyQuantity,
                paddyWeight,
                paddyPrice,
                advancedMoney,
                buyingDue,
                totalInvest,
                sellByDate,
                rice25Quantity,
                rice50Quantity,
                riceTotalQuantity,
                riceTotalPrice,
                title: "Dashboard | Barik Enterpise",
                flashMessage: Flash.getMessage(req)
            });
        }

        res.redirect('/dashboard/create-profile');
    }catch(error){
        next(error);
    }
}

exports.createProfileGetController = async (req, res, next) => {
    try{
        let profile = await Profile.findOne({userId: req.user._id});

        if(profile){
            return res.redirect('/dashboard/edit-profile');
        }
        res.render('pages/dashboard/create-profile', {
            title: "Create Profile | Barik Enterprise",
            flashMessage: Flash.getMessage(req),
            errors: {}
        });

    }catch(error){
        next(error);
    }
}

exports.createProfilePostController = async (req, res, next) => {
    let errors = validationResult(req).formatWith(errorFormatter);

    if(!errors.isEmpty()){
        return res.render('pages/dashboard/create-profile', {
            title: "Create Profile | Barik Enterprise",
            flashMessage: Flash.getMessage(req),
            errors: errors.mapped()
        });    
    }

    let {
        name,
        phone,
        bio,
        website,
        facebook,
        twitter,
        linkedin,
        github
    } = req.body;

    let profilePic = req.user.profilePic;

    try{
        let profile = new Profile({
            userId: req.user._id,
            name,
            phone,
            bio,
            profilePic,
            links: {
                website: website || '',
                facebook: facebook || '',
                twitter: twitter || '',
                linkedin: linkedin || '',
                github: github || ''
            }
        });

        let createdProfile = await profile.save();
        await User.findOneAndUpdate(
            {_id: req.user._id},
            {$set: {profile: createdProfile._id}}
        );

        req.flash('success', 'Profile Created Successfully');
        res.redirect('/dashboard')
        
    }catch(error){
        next(error);
    }   
}

exports.editProfileGetController = async (req, res, next) => {
    try{
        let profile = await Profile.findOne({userId: req.user._id});

        if(!profile){
            console.log(profile);
            return res.redirect('/dashboard/create-profile');
        }

        res.render('pages/dashboard/edit-profile', {
            title: "Edit Profile | Barik Enterprise",
            errors: {},
            flashMessage: Flash.getMessage(req),
            profile
        });
    }catch(error){
        next(error);
    }
}

exports.editProfilePostController = async (req, res, next) => {
    let errors = validationResult(req).formatWith(errorFormatter);

    let {
        name,
        phone,
        bio,
        website,
        facebook,
        twitter,
        linkedin,
        github
    } = req.body;

    if(!errors.isEmpty()){
        return res.render('pages/dashboard/create-profile', {
            title: "Create Profile | Barik Enterprise",
            flashMessage: Flash.getMessage(req),
            errors: errors.mapped(),
            profile: {
                name,
                phone,
                bio,
                website,
                facebook,
                twitter,
                linkedin,
                github
            }
        });    
    }

    try{
        let profile = {
            userId: req.user._id,
            name,
            phone,
            bio,
            links: {
                website: website || '',
                facebook: facebook || '',
                twitter: twitter || '',
                linkedin: linkedin || '',
                github: github || ''
            }
        };

        let updatedProfile = await Profile.findOneAndUpdate(
            {userId: req.user._id},
            {$set: profile},
            {new: true}
        );

        req.flash('success', 'Profile Updated Successfully');
        res.render('pages/dashboard/edit-profile', {
            title: "Edit Profile | Barik Enterprise",
            errors: {},
            flashMessage: Flash.getMessage(req),
            profile:updatedProfile
        });
        
    }catch(error){
        next(error);
    }   
    
}