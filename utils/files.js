const { getFiles } = require("../database");
const { join } = require('path');
const { unlinkSync } = require('fs');

const readFiles = async () => {
    return (await getFiles()).map(e=>e.uuid)
}

const getFilePath = (filename) => {
    return join(__dirname, '..', process.env.FILE_SAVE_PATH || 'uploads/', filename);
}

const deleteFile = (filename) => {
    return unlinkSync(getFilePath(filename));
}

module.exports = {
    readFiles, getFilePath, deleteFile
}