const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'public/uploads/')
    },
    filename: (req, file, callback) => {
        callback(null, file.fieldname + '_' + Date.now() + '_' + file.originalname);
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 
    },
    fileFilter: (req, file, callback) => {
        const  types = /jpeg|jpg|png|gif/;
        const extension = types.test(path.extname(file.originalname));
        const mimeType = types.test(file.mimetype);

        if(extension && mimeType){
            callback(null, true);
        }else{
            callback(new Error("Only support images"));
        }
    }
});

module.exports = upload;