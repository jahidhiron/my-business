const {validationResult} = require('express-validator');
const errorFormatter = require('../utils/validationErrorFormatter');
const Flash = require('../utils/Flash');

const Labour = require('../models/Labour');

// all labour
exports.labourGetController = async (req, res, next) => {
    let labour = await Labour.find();

    res.render('pages/dashboard/labour/labour',{
        title: "All Labour | Barik Enterprise",
        labour,
        flashMessage: Flash.getMessage(req),
        errors: {}
    });
}


// new labour
exports.newLabourGetController = (req, res, next) => {
    res.render('pages/dashboard/labour/newLabour',{
        title: "New Labour | Barik Enterprise",
        flashMessage: Flash.getMessage(req),
        errors: {}
    });
}

exports.newLabourPostController = async (req, res, next) => {
    let errors = validationResult(req).formatWith(errorFormatter);

    if(!errors.isEmpty()){
        console.log(errors.mapped());
        return res.render('pages/dashboard/labour/newLabour', {
            title: "New Labour | Barik Enterprise",
            flashMessage: Flash.getMessage(req),
            errors: errors.mapped()
        }); 
    }
    let {
        name,
        banglaName,
        phone,
        village,
        thana,
        district
    } = req.body;

    try{
        let labour = new Labour({
            name,
            banglaName,
            phone,
            debit: 0,
            credit: 0,
            address: {
                village: village || '',
                thana: thana || '',
                district: district || ''
            }
        });

        await labour.save();

        req.flash('success', 'New Labour Created Successfully');
        res.redirect('/dashboard/labour');

    }catch(error){
        next(error);
    }
}

exports.singleLabourGetController = async (req, res, next) => {
    let labourId = req.params.labourId;
    let labour = await Labour.findOne({_id: labourId});

    try{
        res.render('pages/dashboard/labour/singleLabour',{
            title: `${labour.name} | Barik Enterprise`,
            labour,
            flashMessage: Flash.getMessage(req),
            errors: {}
        });

    }catch(error){
        next(error);
    }
}

// transaction
exports.newTransactionPostController = async (req, res, next) => {
    let labourId = req.params.labourId;
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
        let month = date.getMonth() + 1;
        let transactions = [
            {
                transId: 'mt_' + date.getMonth() + '_dt_'+date.getDate(),
                transCount: 0,
                debit: debit,
                credit: credit,
                time: date.getDate() + '/' + month + '/' + date.getFullYear()
            }
        ];
        await Labour.findOneAndUpdate(
            {_id: labourId},
            {$push: {transactions}}
        );

        let labour = await Labour.findById(labourId);
        let totalDebit = labour.debit + debit;
        let totalCredit = labour.credit + credit;

        if(totalDebit > totalCredit){
            totalDebit -= totalCredit;
            totalCredit = 0;
        }else{
            totalCredit -= totalDebit;
            totalDebit = 0;
        }

        await Labour.findOneAndUpdate(
            {_id: labourId},
            {$set: {debit: totalDebit, credit: totalCredit}}
        );

        req.flash('success', 'New Transaction Created Successfully');
        res.redirect(`/dashboard/singleLabour/${labourId}`);
        
    }catch(error){
        next(error);
    }
}