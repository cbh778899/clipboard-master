const sqlite3 = require('sqlite3').verbose();
let db;
// ===========================================
// INIT
// ===========================================
const init = () => {
    return new Promise(resolve=>{
        // init database connection
        db = new sqlite3.Database(process.env.DATABASE_PATH || 'files.db', (err) => {
            if (err) {
                console.error(err.message);
                resolve(false);
            }
        });

        // create tables
        /**
         * files: ( uuid string, filename string, createdAt integer)
         */
        db.run(`
            CREATE TABLE IF NOT EXISTS files (
                uuid TEXT PRIMARY KEY,
                filename TEXT NOT NULL,
                createdAt INTEGER NOT NULL
            )
        `, (err) => {
            if (err) {
                console.error(err.message);
                resolve(false);
            }
        });
    })
}
// ===========================================
// FILES
// ===========================================
const recordFile = (filename) => {
    return new Promise(resolve=>{
        const uuid = crypto.randomUUID();
        db.run(`INSERT INTO files (uuid, filename, createdAt) VALUES (?, ?, ?)`, [uuid, filename, Date.now()], (err) => {
            if (err) {
                console.error(err.message);
                resolve(null);
            }
            resolve(uuid);
        });
    })
}
const getFileByUUID = (uuid) => {
    return new Promise(resolve=>{
        db.get(`SELECT * FROM files WHERE uuid = ?`, [uuid], (err, row) => {
            if (err) {
                console.error(err.message);
                resolve(null);
            }
            resolve(row);
        });
    })
}
const getFiles = () => {
    return new Promise(resolve=>{
        db.all(`SELECT * FROM files ORDER BY createdAt DESC LIMIT ${process.env.LIST_LIMIT || '30'}`, [], (err, rows) => {
            if (err) {
                console.error(err.message);
                resolve([]);
            }
            resolve(rows);
        });
    })
}

module.exports = {
    init, getFileByUUID, recordFile, getFiles
}