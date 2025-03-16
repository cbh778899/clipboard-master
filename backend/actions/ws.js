// ===========================================
// CLIENTS
// ===========================================
const { getItems } = require("../utils/items-store");
const { randomUUID } = require("crypto");
const clients = {};
const disconnectedClients = {};

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
    Object.values(clients).forEach(({client})=>sendToClient(client, action, messages));
}

// ===========================================
// SEND FROM SERVER
// ===========================================
const sendUpdated = (uuid, type) => {
    sendToAllClients('updated', { uuid, type });
    Object.keys(disconnectedClients).forEach(sessionId => {
        disconnectedClients[sessionId].push({action: 'updated', message: { uuid, type }});
    })
}

const sendRemoved = (uuid) => {
    sendToAllClients('removed', { uuid });
    Object.keys(disconnectedClients).forEach(sessionId => {
        disconnectedClients[sessionId].push({action: 'removed', message: { uuid }});
    })
}

// ===========================================
// ACTIONS
// ===========================================

function connectAction(client, connectionId) {
    const sessionId = randomUUID();
    clients[connectionId].sessionId = sessionId;

    sendToClient(client, 'update-id', { sessionId });
    sendToClient(client, 'sync', { items: getItems() });
}

function reconnectAction(client, connectionId, { sessionId }) {
    clients[connectionId].sessionId = sessionId;
    if (disconnectedClients[sessionId]?.length) {
        disconnectedClients[sessionId].forEach(({action, message})=>sendToClient(client, action, message));
        delete disconnectedClients[sessionId];
    }
}

function handleActions(client, connectionId, action, data) {
    switch(action) {
        case 'connect': 
            connectAction(client, connectionId); break;
        case 'reconnect':
            reconnectAction(client, connectionId, data); break;
    }
}

// ===========================================
// EXPORTS
// ===========================================
const wsHandler = (client) => {
    const connectionId = randomUUID();
    clients[connectionId] = { client };

    const closeWs = () => {
        client.close();
        
        const sessionId = clients[connectionId].sessionId;
        delete clients[connectionId];

        if (Object.keys(clients).length) {
            sessionId && (disconnectedClients[sessionId] = []);
        } else {
            Object.keys(disconnectedClients).forEach(sessionId => {
                delete disconnectedClients[sessionId];
            });
        }
    };
    
    client.on('message', (message) => {
        const { action, ...data } = JSON.parse(message);
        handleActions(client, connectionId, action, data);
    });
    client.on('error', (message) => {
        console.error(message);
        closeWs();
    });
    client.on('close', closeWs);
}

module.exports = {
    wsHandler, sendUpdated, sendRemoved
}