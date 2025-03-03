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
        default:
            return 'png';
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
            const ext = file.name.split('.').pop();
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
