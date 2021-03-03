const {body} = require('express-validator');

module.exports = [
    body('name')
        .not().isEmpty().withMessage("Product can't be empty"),
        
    body('type')
        .not().isEmpty().withMessage("Bag weight type can't be empty") 
];