import { useEffect, useState } from "react";
import requests from "../utils/requests";

const blobs = {};
const objURLs = {}
const components = {};

function updateAll(uuid) {
    components[uuid] && components[uuid].forEach(e => {
        e(objURLs[uuid]);
    })
}

export function getFileBlob(uuid) {
    return blobs[uuid];
}

export async function loadFileToCache(uuid) {
    if (objURLs[uuid]) {
        return true;
    }
    if (blobs[uuid]) {
        objURLs[uuid] = URL.createObjectURL(blobs[uuid]);
        updateAll(uuid);
        return true;
    }
    try {
        const response = await requests(`files?uuid=${uuid}`, {}, { jsonResponse: false });
        if (!response.ok) {
            console.error('Error loading file to cache:', response.status);
            return false;
        }
        const file = await response.blob();
        blobs[uuid] = file;
        const url = URL.createObjectURL(file);
        objURLs[uuid] = url;
        updateAll(uuid);
        return true;
    } catch (error) {
        console.error('Error loading file to cache:', error);
        return false;
    }
}

export default function useCache(uuid) {
    const [ cachedFileURL, setCachedFile ] = useState(objURLs[uuid]);

    useEffect(()=>{
        components[uuid] ??= []
        components[uuid].push(setCachedFile);
        return () => {
            components[uuid].splice(components[uuid].indexOf(setCachedFile), 1);
        }
    }, [setCachedFile, uuid])

    return cachedFileURL;
}