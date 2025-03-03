// ===========================================
// CLIENTS

const { readFiles } = require("../utils/files");

// ===========================================
const clients = [];

function sendToClient(client, action, messages) {
    if (typeof messages === 'string') {
        messages = { message: messages };
    }
    
    client.send(JSON.stringify({
        action,
        ...messages
    }));
}

function sendToAllClients(action, messages) {
    clients.forEach(client=>sendToClient(client, action, messages));
}
// ===========================================
// ACTIONS
// ===========================================

async function syncAction(client) {
    sendToClient(client, 'sync', { files: await readFiles() });
}

function handleActions(client, action, data) {
    switch(action) {
        case 'req-sync': 
            syncAction(client); break;
    }
}

// ===========================================
// EXPORTS
// ===========================================
const wsHandler = (client) => {
    clients.push(client);

    const closeWs = () => {
        client.close();
        clients.splice(clients.indexOf(client), 1);
    };
    client.on('message', (message) => {
        const { action, ...data } = JSON.parse(message);
        handleActions(client, action, data);
    });
    client.on('error', (message) => {
        console.error(message);
        closeWs();
    });
    client.on('close', closeWs);
}

module.exports = {
    wsHandler, sendToAllClients
}