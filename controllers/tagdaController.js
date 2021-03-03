const Flash = require('../utils/Flash');
const Tagda = require('../models/Tagda');

exports.tagdaGetController = async (req, res, next) => {
    let tagda = await Tagda.find();

    if(tagda.length === 0){
        tagda = new Tagda({
            transactions: []
        });
        tagda.save();
    }

    tagda = await Tagda.find();

    res.render('pages/dashboard/tagda',{
        title: "Tagda | Barik Enterprise",
        tagda,
        flashMessage: Flash.getMessage(req),
        errors: {}
    });
}