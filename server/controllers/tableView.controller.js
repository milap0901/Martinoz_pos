const { getDb } = require("../common/getDb");

const db2 = getDb();

const getTable = (req, res) => {
  try {
    const liveDineInOrders = db2
      .prepare(
        "SELECT id, bill_no, dine_in_table_no , item_total, total_discount,  total, order_status, print_count FROM pos_orders WHERE  order_type = 'dine_in' AND order_status = 'accepted' AND settle_amount IS NULL"
      )
      .all([]);

    const liveDineInKots = db2
      .prepare(
        "SELECT id, token_no, table_no FROM kot WHERE order_type = 'dine_in' AND pos_order_id IS NULL AND kot_status != 'cancelled'"
      )
      .all([]);

    liveDineInKots.forEach((kot) => {
      const kotData = db2
        .prepare(
          "SELECT SUM(quantity * (price + tax)) AS kotTotal FROM kot_items WHERE kot_id = ? AND status = ?"
        )
        .get([kot.id, 1]);

      kot.total = kotData.kotTotal;
    });

    const areaStmt = db2.prepare(
      "SELECT id,restaurant_id,restaurant_price_id,area FROM areas"
    );

    const dineInTablesStmt = db2.prepare(
      "SELECT * FROM dine_in_tables WHERE restaurant_id= 1 AND area_id=?"
    );

    const areas = areaStmt.all([]);

    let listedTableNo = [];

    areas.forEach((area) => {
      const dineInTables = dineInTablesStmt.all([area.id]);

      area.tables = dineInTables;

      area.tables.forEach((table) => {
        listedTableNo.push(table.table_no);

        table.kots = [];
        table.orders = [];

        const orderOnTable = liveDineInOrders?.filter(
          (order) => order.dine_in_table_no === table.table_no
        );

        const kotOnTable = liveDineInKots?.filter(
          (kot) => kot.table_no.toString() === table.table_no.toString()
        );

        if (orderOnTable.length) {
          table.orders = orderOnTable;
        }

        if (kotOnTable.length) {
          table.kots = kotOnTable;
        }
      });
    });

    const otherOrders = liveDineInOrders.filter(
      (order) => !listedTableNo.includes(order.dine_in_table_no)
    );

    const otherKots = liveDineInKots.filter(
      (kot) => !listedTableNo.includes(kot.table_no.toString())
    );

    const otherTableKots = [];

    otherKots.forEach((kot) => {
      const existingTableKot = otherTableKots.find(
        (otherTableKot) =>
          otherTableKot.table_no.toString() === kot.table_no.toString()
      );

      if (existingTableKot) {
        existingTableKot.kots.push(kot);
      } else {
        const newOtherTableKot = {
          id: +kot.id,
          table_no: kot.table_no.toString(),
          area_id: areas.length + 1,
          kots: [kot],
          orders: [],
        };
        otherTableKots.push(newOtherTableKot);
      }
    });

    const otherTablesOrders = otherOrders.map((order) => {
      return {
        id: +order.id,
        table_no: order.dine_in_table_no.toString(),
        area_id: areas.length + 1,
        orders: [order],
        kots: [],
      };
    });

    const otherArea = {
      id: areas.length + 1,
      restaurant_id: 1,
      restaurant_price_id: 4,
      area: "Other Tables",
      tables: [...otherTablesOrders, ...otherTableKots],
    };

    areas.push(otherArea);

    res.status(200).json({
      status: false,
      message: "get tables successfully ",
      data: areas,
      error: false,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "get tables Failed",
      data: undefined,
      error,
    });
  }
};

module.exports = { getTable };
