import { getFileBlob } from "../hooks/useCache";
import requests, { generateRequestRoute } from "./requests";

const mimeToExt = {
    // Images
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/gif": "gif",
    "image/webp": "webp",
    "image/svg+xml": "svg",
    "image/bmp": "bmp",
    "image/tiff": "tiff",
    "image/x-icon": "ico",
    // texts
    "text/plain": "txt",
    // "text/csv": "csv",
    // "text/html": "html",
    // "text/javascript": "js",
    // "text/xml": "xml",
    // "text/css": "css",
    // "text/markdown": "md",
};

function getExtensionFromMimeType(mimeType) {
    return mimeToExt[mimeType] || 'unknown';
}

async function uploadFile(blob, ext, filename = '') {
    const formData = new FormData();
    const file = new File([blob], filename || `file.${ext}`);
    formData.append('file', file);

    try {
        const response = await fetch(`${generateRequestRoute('items/upload')}`, {
            method: 'POST',
            body: formData
        });
        if (!response.ok) {
            console.error(response);
            return;
        }
    } catch (error) {
        console.error('Error uploading file:', error);
        return
    }
}

export async function deleteFile(uuid) {
    const response = await requests(`items/${uuid}`, {
        method: 'DELETE'
    })

    if (response.error) {
        console.error(response.error);
    }
}

// for image & text only
export function watchPasteImageEvent(event) {
    const items = event.clipboardData.items;
    for (const item of items) {
        const ext = getExtensionFromMimeType(item.type);
        if (ext === 'unknown') continue;

        if (item.kind === 'file') {
            const blob = item.getAsFile();
            uploadFile(blob, ext);
        } else if (item.kind === 'string' && item.type.startsWith('text')) {
            item.getAsString((content) => {
                const blob = new Blob([content], { type: item.type });
                uploadFile(blob, ext);
            })
        }
    }
}

// file only, no matter what kind of file
export function handleDropFile(event) {
    const files = event.dataTransfer.files;
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        uploadFile(file, '', file.name);
    }
}

// images and text only
export async function readFromClipboard() {
    const clipboardItems = await navigator.clipboard.read();
    for (const clipboardItem of clipboardItems) {
        for (const type of clipboardItem.types) {
            const ext = getExtensionFromMimeType(type);
            if (ext === 'unknown') {
                continue;
            }
            const blob = await clipboardItem.getType(type);
            await uploadFile(blob, ext);
        }
    }
}

export function downloadGif(objURL) {
    const a = document.createElement('a');
    a.href = objURL;
    a.download = 'dwonload.gif';
    a.click();
    return true;
}

export async function copyImage(uuid, objURL) {
    const blob = getFileBlob(uuid);
    if (!blob) return;

    let copyObj = blob;
    const ext = getExtensionFromMimeType(blob.type);

    if (ext === 'unknown') return;
    else if (ext === 'gif') return downloadGif(objURL);
    else if (ext !== 'png') {
        const pngBlob = await new Promise(resolve=>{
            const img = new Image();
            img.src = objURL;
            img.onload = () => {
                const width = img.naturalWidth;
                const height = img.naturalHeight;
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                canvas.toBlob(blob => {
                    resolve(blob)
                    canvas.remove();
                    img.remove();
                }, 'image/png')
            }
        })
        copyObj = pngBlob;
    }

    navigator.clipboard.write([
        new ClipboardItem({
            [copyObj.type]: copyObj
        })
    ]);
}