// const { dbAll, dbRun } = require("../common/dbExecute");

const { getDb } = require("../common/getDb");
const db2 = getDb();

const getHoldOrders =  () => {
	const holdOrders = db2.prepare("SELECT * FROM hold_orders").all();
	// const holdOrders = await dbAll(db, "SELECT * FROM hold_orders", []);

	const holdOrdersWithItems = holdOrders.map((order) => {
		const holdOrderItems = db2.prepare("SELECT * FROM hold_order_items  WHERE Hold_order_id = ?").all([order.id]);
		// const holdOrderItems = await dbAll(db, "SELECT * FROM hold_order_items  WHERE Hold_order_id = ?", [order.id]);

		const itemsWithAddons = holdOrderItems.map((item) => {
			const itemAddons = db2.prepare("SELECT * FROM hold_order_item_addongroupitems WHERE hold_order_item_id = ?").all([item.id]);

			return { ...item, toppings: itemAddons, itemTax: JSON.parse(item.itemTax) };
		});

		return { ...order, orderCart: itemsWithAddons };
	});

	return holdOrdersWithItems;
};

module.exports = { getHoldOrders };
