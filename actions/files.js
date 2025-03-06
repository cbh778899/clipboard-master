const { getFileByUUID, recordFile, deleteItemByUUID } = require('../database');
const { getFilePath, deleteFile } = require('../utils/files');
const { sendToAllClients } = require('./ws')

const upload = async (req, res) => {
    const { file } = req;
    if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
    } 
    
    const uuid = await recordFile(file.filename);
    if (!uuid) {
        return res.status(500).json({ message: 'Failed to save file' });
    } else {
        sendToAllClients('updated', { uuid })
        return res.status(200).json({ uuid });
    }
}

const get = async (req, res) => {
    const { uuid } = req.query;
    const file = await getFileByUUID(uuid);
    if (!file) {
        return res.status(404).json({ message: 'File not found' });
    }

    const { filename } = file;
    return res.sendFile(getFilePath(filename));
}

const deleteItem = async (req, res) => {
    const { uuid } = req.params;
    const result = await deleteItemByUUID(uuid);
    if (result) {
        deleteFile(result.filename);
        sendToAllClients('removed', { uuid })
        return res.status(200).json({ message: 'File deleted successfully' });
    } else {
        return res.status(500).json({ message: 'Failed to delete file' });
    }
}

module.exports = {
    upload, get, deleteItem
}