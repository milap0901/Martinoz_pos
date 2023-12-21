

const { getDb } = require("../common/getDb")
const db2 = getDb()


const updateKOT = ({ id, order_id, order_type,kot_status}) => {
      // console.log(order_id)
      try {
            db2.prepare("UPDATE kot SET kot_status = ?, sync = 0, updated_at = datetime('now', 'localtime') WHERE id=? ").run([kot_status,id]);
            // dbRun(db, "UPDATE KOT SET KOT_status = 'food is ready' WHERE id=? ", [id]);

            
      } catch (err) {
            console.log(err);
      }
};

module.exports = { updateKOT };
