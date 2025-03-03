const path = require('path');
const multer = require('multer');
const { randomId } = require('./tools');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, process.env.FILE_SAVE_PATH || 'uploads/') // Files will be stored in 'uploads' directory
    },
    filename: function(req, file, cb) {
        // Create unique filename with original extension
        cb(null, `${randomId()}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage }).single('file');

module.exports = upload;