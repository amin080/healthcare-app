const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

let dbInstance = null;

const connectDB = async () => {
    if (dbInstance) return dbInstance;

    try {
        dbInstance = await open({
            filename: path.join(__dirname, '..', 'DBHealth.db'),
            driver: sqlite3.Database
        });
        console.log('Connected to SQLite Database (MVC Mode)');
        return dbInstance;
    } catch (error) {
        console.error('Database Error:', error);
    }
};

module.exports = connectDB;