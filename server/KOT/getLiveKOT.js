// const Database = require("better-sqlite3");
// const db2 = new Database("restaurant.sqlite", {});

const { getDb } = require("../common/getDb");
const db2 = getDb();

const getLiveKOT = () => {
	const liveKOTs = db2.prepare("SELECT * FROM kot WHERE (kot_status = 'accepted') OR (order_type = 'dine_in' AND pos_order_id IS NULL) AND kot_status != 'cancelled'").all([]);
	// const liveKOTs = await dbAll(db, "SELECT * FROM KOT WHERE KOT_status = 'accepted'", []);

	const prepareKOTItem = db2.prepare("SELECT * FROM kot_items WHERE kot_id = ?");
	// const prepareAddon = db2.prepare("SELECT * FROM KOT_item_addongroupitems WHERE KOT_item_id = ?");
	const parentTaxStmt = db2.prepare("SELECT child_ids FROM taxes where id=?");

	const taxesStmt = db2.prepare("SELECT * FROM taxes where id = ? ");
	const tableStmt = db2.prepare("SELECT area_id FROM dine_in_tables WHERE table_no=?");
	const areaStmt = db2.prepare("SELECT id,area,restaurant_price_id FROM areas WHERE id=?");
	const defaultResaurantPriceStmt = db2.prepare("SELECT configuration FROM restaurants WHERE id=?");
	const categoryStmt = db2.prepare("SELECT category_id FROM items WHERE id=?");
	const configDetail = defaultResaurantPriceStmt.get([1]);
	const defaultRestaurantPrice = JSON.parse(configDetail.configuration).default_restaurant_price;
	const orderDetailStmt = db2.prepare("SELECT extra_data FROM pos_orders WHERE id = ?");

	const liveKOTsWithItems = liveKOTs.map(KOT => {
		const KOTItems = prepareKOTItem.all([KOT.id]);
		

		let restaurantPriceId = defaultRestaurantPrice ? +defaultRestaurantPrice : null;
		let areaName = "";
		let areaId = "";
		let online_order_id = null;

		if (KOT.order_type === "dine_in") {
			const table = tableStmt.get(KOT.table_no);

			if (table && table.area_id) {
				const area = areaStmt.get(table.area_id);
				restaurantPriceId = +area.restaurant_price_id;
				areaName = area.area;
				areaId = area.id;
			}
		}

		if (KOT.pos_order_id !== null) {
			const orderDetail = orderDetailStmt.get([KOT.pos_order_id]);
			
			online_order_id = JSON.parse(orderDetail?.extra_data)?.online_order_id
			
		}

		const itemsWithAddons = KOTItems.map(item => {
			// const itemAddons = prepareAddon.all([item.id]);
			// const itemAddons = await dbAll(db, "SELECT * FROM KOT_item_addongroupitems WHERE KOT_item_id = ?", [item.id]);

			let itemData = categoryStmt.get([item.item_id]);
			const childTaxesString = item.tax_id ? parentTaxStmt.get(item.tax_id) : { child_ids: "" };

			const taxesIdArray = childTaxesString.child_ids.length ? childTaxesString.child_ids.split(",") : [];

			const taxesArray = taxesIdArray.map(tax => {
				const taxData = taxesStmt.get(tax);

				const itemTax = { tax_id: taxData.id, tax_name: taxData.name, tax_percent: taxData.tax, tax_amount: (taxData.tax * item.price) / 100 };
				return itemTax;
			});

			
			return { ...item, categoryId: itemData.category_id, item_addons: JSON.parse(item.item_addon_items), item_tax: taxesArray };
		});

		return { ...KOT, items: itemsWithAddons, restaurantPriceId, areaName, areaId,online_order_id };
	});

	return liveKOTsWithItems;
};

module.exports = { getLiveKOT };
