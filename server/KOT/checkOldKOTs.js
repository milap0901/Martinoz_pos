// const Database = require("better-sqlite3");
// const db2 = new Database("restaurant.sqlite", {});

const { getDb } = require("../common/getDb")
const db2 = getDb()


const checkOldKOTs = (table_number) => {
      const oldKOTs = db2.prepare("SELECT id FROM kot WHERE order_type='dine_in' AND table_no=? AND  pos_order_id IS NULL AND kot_status !='cancelled'").all([table_number]);

      return oldKOTs.length === 0 ? false : true;
};

module.exports = { checkOldKOTs };
