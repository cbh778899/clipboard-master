// ===========================================
// INITIALIZE
// ===========================================
require("dotenv").config()
const { join } = require('path')

const express = require("express");
const https = require('https');
const app = express();
app.use(require('cors')());
const expressWs = require('express-ws');
app.use(express.static(join(__dirname, 'dist')));
const bodyParserJSON = require('body-parser').json();

require('./database').init();

const { upload, get, deleteItem } = require('./actions/files');
const middleware = require('./utils/multer-config');

const FILE_SAVE_PATH = process.env.FILE_SAVE_PATH || 'uploads/';
const { existsSync, mkdirSync, readFileSync } = require('fs');
if (!existsSync(FILE_SAVE_PATH)) {
    mkdirSync(FILE_SAVE_PATH);
}

let server = null;
const secureConnection = existsSync('cert');
if (secureConnection) {
    server = https.createServer({
        key: readFileSync(join(__dirname, 'cert', 'private.key')),
        cert: readFileSync(join(__dirname, 'cert', 'certificate.crt'))
    }, app);
    expressWs(app, server);
} else {
    expressWs(app);
}

// ===========================================
// FILES
// ===========================================
const filesRouter = express.Router();
filesRouter.post('/upload', middleware, upload);
filesRouter.get('/', bodyParserJSON, get);
filesRouter.delete('/:uuid', bodyParserJSON, deleteItem);

// ===========================================
// Websocket
// ===========================================
app.ws('/api/ws', require('./actions/ws').wsHandler)

// ===========================================
// Base routers
// ===========================================
app.use('/api/files', filesRouter);
app.get('*', (_, res)=>{
    res.sendFile(join(__dirname, 'dist', 'index.html'));
})

// ===========================================
// START APP
// ===========================================
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const { getLocalIP } = require("./utils/tools");

const serverInstance = server || app;
serverInstance.listen(PORT, HOST, ()=>{
    console.log(
`Server is running on http${secureConnection ? 's' : ''}://localhost:${PORT}
Find your application on LAN: http${secureConnection ? 's' : ''}://${getLocalIP()}:${PORT}`
);
});