const { getDb } = require("../common/getDb");
const db2 = getDb();

const getHoldOrders = () => {
  const holdOrdersData = db2.prepare("SELECT * FROM hold_orders").all();

  //   console.log(holdOrdersData);

  const result = holdOrdersData.map((order) => {
    const id = order.id;
    const created_at_Time = order.created_at;
    const holdOrder = JSON.parse(order.order_json);
    return { holdOrder, id, created_at_Time };
  });

  return result;
};

module.exports = { getHoldOrders };
