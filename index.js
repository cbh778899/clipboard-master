// ===========================================
// INITIALIZE
// ===========================================
require("dotenv").config()
const { join } = require('path')

const express = require("express");
const app = express();
app.use(require('cors')());
require('express-ws')(app);
app.use(express.static(join(__dirname, 'dist')));
const bodyParserJSON = require('body-parser').json();

require('./database').init();

const { upload, get } = require('./actions/files');
const middleware = require('./utils/multer-config');

const FILE_SAVE_PATH = process.env.FILE_SAVE_PATH || 'uploads/';
const { existsSync, mkdirSync } = require('fs');
if (!existsSync(FILE_SAVE_PATH)) {
    mkdirSync(FILE_SAVE_PATH);
}

// ===========================================
// FILES
// ===========================================
const filesRouter = express.Router();
filesRouter.post('/upload', middleware, upload);
filesRouter.get('/', bodyParserJSON, get);

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
app.listen(PORT, HOST, ()=>{
    console.log(`Server is running on port ${PORT}`);
});