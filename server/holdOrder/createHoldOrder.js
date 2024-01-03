const { getDb } = require("../common/getDb");
const db2 = getDb();

const createHoldOrder = async (order) => {
  try {
    const create = db2
      .prepare(
        "insert into hold_orders ( order_json , created_at , updated_at ) values ( ? , datetime('now', 'localtime') ,datetime('now', 'localtime'))"
      )
      .run([JSON.stringify(order)]);

    return create;
  } catch (err) {
    console.log(err);
  }
};

module.exports = { createHoldOrder };
