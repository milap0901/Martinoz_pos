// const Database = require("better-sqlite3");
// const db2 = new Database("restaurant.sqlite", {});

const { getDb } = require("../common/getDb");
const db2 = getDb();

const getOldKOTs = tableNo => {
	let mergedKot = {
		customerName: "",
		customerContact: "",
		customerAdd: "",
		customerLocality: "",
		orderCart: [],
		orderComment: "",
		subTotal: 0,
	};

	let kotComments = [];

	const liveKOTs = db2
		.prepare("SELECT id,customer_name,phone_number,address,landmark,description FROM kot WHERE order_type='dine_in' AND table_no=? AND pos_order_id IS NULL AND kot_status != 'cancelled'")
		.all([tableNo]);
	// const liveKOTs = await dbAll(db, "SELECT * FROM KOT WHERE KOT_status = 'accepted'", []);

	const prepareKOTItem = db2.prepare("SELECT * FROM kot_items WHERE kot_id = ? AND status != ?");
	// const prepareAddon = db2.prepare("SELECT * FROM KOT_item_addongroupitems WHERE KOT_item_id = ?");

	const parentTaxStmt = db2.prepare("SELECT child_ids FROM taxes where id=?");

	const taxesStmt = db2.prepare("SELECT * FROM taxes where id = ? ");

	mergedKot.customerName = liveKOTs[0]?.customer_name || "";
	mergedKot.customerContact = liveKOTs[0]?.phone_number || "";
	mergedKot.customerAdd = liveKOTs[0]?.address || "";
	mergedKot.customerLocality = liveKOTs[0]?.landmark;

	const liveKOTsWithItems = liveKOTs.map(KOT => {
		KOT.description ? kotComments.push(KOT.description) : null;

		const KOTItems = prepareKOTItem.all([KOT.id, 0]);

		const itemsWithAddons = KOTItems.map(item => {
			const childTaxesString = item.tax_id ? parentTaxStmt.get(item.tax_id) : { child_ids: "" };

			const taxesIdArray = childTaxesString.child_ids.length ? childTaxesString.child_ids.split(",") : [];

			const taxesArray = taxesIdArray.map(tax => {
				const taxData = taxesStmt.get(tax);
				const itemTax = { tax_id: taxData.id, tax_name: taxData.name, tax_percent: taxData.tax, tax_amount: (taxData.tax * item.price) / 100 };
				return itemTax;
			});

			mergedKot.subTotal += item.price * item.quantity;

			return { ...item, item_addons: JSON.parse(item.item_addon_items), item_tax: taxesArray };
			// return { ...item, item_addons:JSON.parse(item.item_addon_items), item_tax: item.tax }
		});

		mergedKot.orderCart.push(...itemsWithAddons);
	});

	mergedKot.orderComment = kotComments.join(", ");

	return mergedKot;
};

module.exports = { getOldKOTs };
