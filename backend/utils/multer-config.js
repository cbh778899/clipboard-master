const multer = require('multer');
const { existsSync } = require('fs');
const { getFilePath } = require('./files');
const { join } = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, join(__dirname, '..', '..', process.env.FILE_SAVE_PATH || 'uploads/'))
    },
    filename: function(req, file, cb) {
        const decode_name = Buffer.from(file.originalname, 'latin1').toString('utf8');
        let filename = `${Date.now()}-${decode_name}`
        if (
            !/^.*\.(png|jpg|jpg|gif|webp|svg|bmp|tiff|ico|txt)$/.test(decode_name) && 
            !existsSync(getFilePath(decode_name))
        ) {
            filename = decode_name;
        }
        cb(null, filename);
    }
});

const upload = multer({ storage: storage }).single('file');

module.exports = upload;