const { join } = require('path')
const { existsSync, mkdirSync, readdirSync, readFileSync, statSync } = require("fs")
const { randomUUID } = require('crypto');
const { getTypeFromExt } = require('./tools');

const FILE_SAVE_PATH = join(__dirname, '..', process.env.FILE_SAVE_PATH || 'uploads/');

const store = []

const init = () => {
    if (!existsSync(FILE_SAVE_PATH)) {
        mkdirSync(FILE_SAVE_PATH);
        return;
    }

    const items = readdirSync(FILE_SAVE_PATH);
    items.forEach(item => {
        const uuid = randomUUID();
        const createdAt = statSync(join(FILE_SAVE_PATH, item)).birthtimeMs;
        const type = getTypeFromExt(item);
        const itemObj = { uuid, createdAt, type, filename: item }

        if (type === 'text') {
            itemObj.content = readFileSync(join(FILE_SAVE_PATH, item), 'utf-8');
        }

        store.push(itemObj);
    });

    store.sort((a, b) => b.createdAt - a.createdAt);
}

const getItems = () => {
    return store.map(e=>{return { uuid: e.uuid, type: e.type }});
}

const getItem = (uuid) => {
    return store.find(e => e.uuid === uuid);
}

const addItem = (type, filename) => {
    const uuid = randomUUID();
    const item = { uuid, type, filename }
    if (type === 'text') {
        item.content = readFileSync(join(FILE_SAVE_PATH, filename), 'utf-8');
    }
    store.unshift(item);
    return uuid;
}

const removeItem = (uuid) => {
    const index = store.findIndex(e => e.uuid === uuid);
    if (index !== -1) {
        const removedItem = store.splice(index, 1).pop();
        return removedItem;
    } else {
        return null;
    }
}

module.exports = {
    init, getItems, getItem, addItem, removeItem
}