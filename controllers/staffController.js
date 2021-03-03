const {validationResult} = require('express-validator');
const errorFormatter = require('../utils/validationErrorFormatter');
const Flash = require('../utils/Flash');

const Staff = require('../models/Staff');

// staff
exports.staffGetController = async (req, res, next) => {
    let staff = await Staff.find();

    res.render('pages/dashboard/staff/staff',{
        title: "Staff | Barik Enterprise",
        staff,
        flashMessage: Flash.getMessage(req),
        errors: {}
    });
}

exports.staffPostController = (req, res, next) => {
    next();
}


// new staff
exports.newStaffGetController = async (req, res, next) => {
    res.render('pages/dashboard/staff/newStaff',{
        title: "New Staff | Barik Enterprise",
        flashMessage: Flash.getMessage(req),
        errors: {}
    });
}

exports.newStaffPostController = async (req, res, next) => {
    let errors = validationResult(req).formatWith(errorFormatter);

    if(!errors.isEmpty()){
        return res.render('pages/dashboard/staff/newStaff', {
            title: "New Staff | Barik Enterprise",
            flashMessage: Flash.getMessage(req),
            errors: errors.mapped()
        }); 
    }
    let {
        name,
        banglaName,
        phone,
        salary,
        village,
        thana,
        district
    } = req.body;

    try{
        let staff = new Staff({
            name,
            banglaName,
            phone,
            salary,
            debit: 0,
            credit: 0,
            address: {
                village: village,
                thana: thana,
                district: district
            }
        });

        await staff.save();

        req.flash('success', 'New Staff Created Successfully');
        res.redirect('/dashboard/staff');

    }catch(error){
        next(error);
    }
}


// single staff
exports.singleStaffGetController = async (req, res, next) => {
    let staffId = req.params.staffId;
    let staff = await Staff.findOne({_id: staffId});

    try{
        res.render('pages/dashboard/staff/singleStaff',{
            title: `${staff.name} | Barik Enterprise`,
            staff,
            flashMessage: Flash.getMessage(req),
            errors: {}
        });

    }catch(error){
        next(error);
    }
}

// transaction
exports.newTransactionPostController = async (req, res, next) => {
    let staffId = req.params.staffId;
    let date = new Date();

    let {
        debit,
        credit
    } = req.body;

    debit = parseInt(debit);
    credit = parseInt(credit);

    if(!debit){
        debit = 0;
    }
    if(!credit){
        credit = 0;
    }
    
    try{
        let month = date.getMonth();
        let transactions = [
            {
                transId: 'mt_' + date.getMonth() + '_dt_'+date.getDate(),
                transCount: 0,
                debit: debit,
                credit: credit,
                time: date.getDate() + '/' + month + '/' + date.getFullYear()
            }
        ];
        await Staff.findOneAndUpdate(
            {_id: staffId},
            {$push: {transactions}}
        );

        let staff = await Staff.findById(staffId);
        let totalDebit = staff.debit + debit;
        let totalCredit = staff.credit + credit;

        if(totalDebit > totalCredit){
            totalDebit -= totalCredit;
            totalCredit = 0;
        }else{
            totalCredit -= totalDebit;
            totalDebit = 0;
        }

        await Staff.findOneAndUpdate(
            {_id: staffId},
            {$set: {debit: totalDebit, credit: totalCredit}}
        );

        req.flash('success', 'New Transaction Created Successfully');
        res.redirect(`/dashboard/singleStaff/${staffId}`);
        
    }catch(error){
        next(error);
    }
}

