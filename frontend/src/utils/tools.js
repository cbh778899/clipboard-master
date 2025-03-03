import { getFileBlob } from "../hooks/useCache";
import { generateRequestRoute } from "./requests";

function getExtensionFromMimeType(mimeType) {
    switch (mimeType) {
        case 'image/png':
            return 'png';
        case 'image/jpeg':
        case 'image/jpg':
            return 'jpg';
        case 'image/gif':
            return 'gif';
        case 'image/webp':
            return 'webp';
        case 'image/bmp':
            return 'bmp';
    }
}



async function uploadFile(blob, ext) {
    const formData = new FormData();
    const file = new File([blob], `file.${ext}`);
    formData.append('file', file);

    try {
        const response = await fetch(`${generateRequestRoute('files/upload')}`, {
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

export function watchPasteImageEvent(event) {
    const items = (event.clipboardData || event.originalEvent.clipboardData).items;
    for (let index in items) {
        const item = items[index];
        if (item.kind === 'file') {
            const blob = item.getAsFile();
            const ext = getExtensionFromMimeType(blob.type);
            uploadFile(blob, ext);
        }
    }
}

export function watchDropEvent(event) {
    const files = event.dataTransfer.files;
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
            const ext = getExtensionFromMimeType(file.type);
            uploadFile(file, ext);
        }
    }
}

export async function readFromClipboard() {
    const clipboardItems = await navigator.clipboard.read();
    for (const clipboardItem of clipboardItems) {
        for (const type of clipboardItem.types) {
            if (type.startsWith('image/')) {
                const blob = await clipboardItem.getType(type);
                const ext = getExtensionFromMimeType(blob.type);
                await uploadFile(blob, ext);
            }
        }
    }
}

export async function copyImage(uuid, objURL) {
    const blob = getFileBlob(uuid);
    if (!blob) {
        return;
    }

    let copyObj = blob;

    if (getExtensionFromMimeType(blob.type) !== 'png') {
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