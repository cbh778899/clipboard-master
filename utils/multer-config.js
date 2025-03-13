const multer = require('multer');
const { existsSync } = require('fs');
const { getFilePath } = require('./files');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, process.env.FILE_SAVE_PATH || 'uploads/')
    },
    filename: function(req, file, cb) {
        let filename = `${Date.now()}-${file.originalname}`
        if (
            !/^.*\.(png|jpg|jpg|gif|webp|svg|bmp|tiff|ico|txt)$/.test(file.originalname) && 
            !existsSync(getFilePath(file.originalname))
        ) {
            filename = file.originalname;
        }
        cb(null, filename);
    }
});

const upload = multer({ storage: storage }).single('file');

module.exports = upload;