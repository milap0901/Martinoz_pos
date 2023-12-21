// const { dbAll, dbRun } = require("../common/dbExecute");

const { getDb } = require("../common/getDb");
const db2 = getDb();


const deletHoldOrder =  (id) => {

      db2.prepare("DELETE FROM hold_orders WHERE id=?").run([id])
      // dbRun(db, "DELETE FROM hold_orders WHERE id=?", [id]);
};

module.exports = { deletHoldOrder };
