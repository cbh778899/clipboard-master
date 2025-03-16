const os = require('os');

const getLocalIP = () => {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return '127.0.0.1';
}

const getTypeFromExt = (filename) => {
    filename = filename.toLowerCase();
    if (/^.*\.(jpg|jpeg|png|gif|webp|bmp|tiff|svg)$/.test(filename)) {
        return 'image';
    } else if (/^.*\.(txt|csv|html|js|xml|css|md)$/.test(filename)) {
        return 'text';
    } else {
        return 'file';
    }
}

module.exports = {
    getLocalIP,
    getTypeFromExt
}