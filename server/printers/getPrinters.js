// const Database = require("better-sqlite3");
// const db2 = new Database("restaurant.sqlite", {});

const { getDb } = require("../common/getDb")
const db2 = getDb()


const getPrinters = () => {
      const printerData = db2.prepare("SELECT * FROM printers").all([]);
      return printerData;
};

module.exports = { getPrinters };
