const { getFiles } = require("../database");
const { join } = require('path');

const readFiles = async () => {
    return (await getFiles()).map(e=>e.uuid)
}

const getFilePath = (filename) => {
    return join(__dirname, '..', process.env.FILE_SAVE_PATH || 'uploads/', filename);
}

module.exports = {
    readFiles, getFilePath
}