import { useEffect, useState } from "react";
import { getWsRoute } from "../utils/requests";
import { deleteFileFromCache, loadFileToCache } from "./useCache";

let wsClient;
let firstConnect = true;
let sessionId = '';

const valuesStore = {};
const components = {};

function updateAll(action) {
    components[action] && components[action].forEach(e => {
        e(valuesStore[action]);
    })
}

export function sendMessage(action, data) {
    if (!wsClient || wsClient.readyState !== WebSocket.OPEN) return;
    
    if (!data) {
        data = {}
    } else if (typeof data !== 'object') {
        data = {data}
    }

    wsClient.send(JSON.stringify({
        action,
        ...data
    }));
}

export function closeWsClient() {
    if (!wsClient || wsClient.readyState === WebSocket.CONNECTING) return;
    wsClient.close();
    wsClient = null;
}

async function handleUpdated({ uuid, type }) {
    await loadFileToCache(uuid, type);
    
    if (!valuesStore.items.some(file => file.uuid === uuid)) {
        valuesStore.items = [{uuid, type}, ...valuesStore.items];
    }
    updateAll('items');
}

async function handleSync({ items }) {
    for await (const {uuid, type} of items) {
        await loadFileToCache(uuid, type);
    }

    valuesStore.items = (valuesStore.items ?? []).concat(items)
    updateAll('items');
}

async function handleRemoved({ uuid }) {
    valuesStore.items = valuesStore.items.filter(e=>e.uuid !== uuid);
    updateAll('items');
    deleteFileFromCache(uuid);
}

function handleActions(action, data) {
    switch(action) {
        case 'updated':
            handleUpdated(data);
            break;
        case 'sync':
            handleSync(data);
            break;
        case 'removed':
            handleRemoved(data);
            break;
        case 'update-id':
            sessionId = data.sessionId;
            break;
        default:
            valuesStore[action] = data;
            updateAll(action);
            break;
    }
}

export function initClient() {
    if (!wsClient) {
        wsClient = new WebSocket(getWsRoute());
    } else {
        return;
    }


    wsClient.onopen = () => {
        console.log('ws opened');
        if (firstConnect) {
            sendMessage('connect');
            firstConnect = false;
        } else {
            sendMessage('reconnect', { sessionId });
        }
    }

    wsClient.onmessage = (event) => {
        const {action, ...data} = JSON.parse(event.data);
        handleActions(action, data);
    }

    wsClient.onclose = () => {
        console.log('ws closed');
        closeWsClient();
        setTimeout(initClient, 10);
    }

    wsClient.onerror = (error) => {
        console.log('ws error', error);
        closeWsClient();
    }
}

function useSocket(listenTo) {
    const [state, setState] = useState(valuesStore[listenTo]);
    
    useEffect(()=>{
        components[listenTo] ??= [];
        components[listenTo].push(setState);

        return () => {
            components[listenTo].splice(components[listenTo].indexOf(setState), 1);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setState])

    return state;
}

export default useSocket;