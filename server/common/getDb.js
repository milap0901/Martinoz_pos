const Database = require("better-sqlite3");
const dbPath = process.argv[2]

function getDb() {
    
    const db2 = new Database(dbPath, {});
	return db2;

}

module.exports = { getDb };

