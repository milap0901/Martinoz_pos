// const { dbAll, dbRun } = require("../common/dbExecute");
// const Database = require("better-sqlite3");
// const db2 = new Database("restaurant.sqlite", {});
const { getDb } = require("../common/getDb");
const db2 = getDb();

const updateLiveOrders = data => {
	let { orderStatus, orderId, orderType, KOTId, print_count, tip, settleAmount, customerPaid, paymentType, multipay, updatedStatus } = data;

	if (orderType === "dine_in") {
		try {
			if (print_count === 0) {
				db2.prepare("UPDATE pos_orders SET print_count=?, sync = 0, updated_at = datetime('now', 'localtime') WHERE id=?").run([1, orderId]);
			} else {
				db2.transaction(() => {
					const updateOrderStatement = db2.prepare(
						`UPDATE pos_orders SET settle_amount = ${settleAmount !== "" ? settleAmount : "total"},
                                    tip = ${tip !== "" ? tip : 0},
                                    payment_type = ?, sync = 0, updated_at = datetime('now', 'localtime')
                                    WHERE id = ?`
					);

					updateOrderStatement.run([paymentType, orderId]);
					const multipayPrepare = db2.prepare("INSERT INTO multipays (pos_order_id, payment_type, amount) VALUES (?, ?, ?)");

					if (paymentType === "multipay") {
						db2.transaction(() => {
							db2.prepare("DELETE FROM multipays WHERE pos_order_id =? ").run([orderId]);
						})();

						multipay.forEach(partPay => {
							if (+partPay.amount) {
								multipayPrepare.run([orderId, partPay.name, partPay.amount]);
							}
						});
					}
					if (paymentType === "due") {
						multipayPrepare.run([orderId, "due", settleAmount]);
					}
				})();
			}
		} catch (err) {
			console.log(err);
		}
	} else {
		// const statusMap = {
		//       // "dine_in": ["accepted", "printed", "settled"],
		//       delivery: ["accepted", "food_is_ready", "dispatched", "delivered"],
		//       pick_up: ["accepted", "food_is_ready", "picked_up"],
		// };

		// const statuses = statusMap[orderType] || [];
		// const current = statuses.findIndex((element) => element === orderStatus);
		// const updatedStatus = statuses[current + 1];

		try {
			db2.prepare("UPDATE pos_orders SET order_status=?, settle_amount=total, sync = 0, updated_at = datetime('now', 'localtime') WHERE id=? AND order_status != 'cancelled'").run([
				updatedStatus,
				orderId,
			]);

			if (orderType !== "dine_in" && updatedStatus === "food_is_ready") {
				db2.prepare("UPDATE kot SET kot_status=?, updated_at = datetime('now', 'localtime'), sync = 0 WHERE id = ?").run(["food_is_ready", KOTId]);
			}
		} catch (err) {
			console.log(err);
		}
	}
};

module.exports = { updateLiveOrders };
