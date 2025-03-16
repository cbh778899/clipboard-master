const { getFilePath, deleteFile } = require('../utils/files');
const { addItem, getItem, removeItem } = require('../utils/items-store');
const { getTypeFromExt } = require('../utils/tools');
const { sendUpdated, sendRemoved } = require('./ws')

const upload = (req, res) => {
    const { file } = req;
    if (!file) {
        return res.status(400).end();
    }
    const type = getTypeFromExt(file.originalname);
    const uuid = addItem(type, file.filename);
    if (!uuid) {
        return res.status(500).json({ message: 'Failed to save file' });
    } else {
        sendUpdated(uuid, type);
        return res.status(200).json({ uuid });
    }
}

const get = (req, res) => {
    const { uuid, request_name = 0 } = req.query;
    const item = getItem(uuid);
    if (!item) {
        return res.status(404).end();
    }

    if (item.type === 'text') {
        return res.status(200).json({ content: item.content })
    } else if (+request_name && item.type === 'file') {
        return res.status(200).json(item)
    } else {
        return res.status(200).sendFile(getFilePath(item.filename));
    }
}

const deleteItem = (req, res) => {
    const { uuid } = req.params;
    const result = removeItem(uuid);
    if (result) {
        deleteFile(result.filename);
        sendRemoved(uuid);
        return res.status(200).json({ success: true });
    } else {
        return res.status(500).json( { success: false } );
    }
}

module.exports = {
    upload, get, deleteItem
}