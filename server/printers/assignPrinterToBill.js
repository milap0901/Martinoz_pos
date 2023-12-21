// const Database = require("better-sqlite3");
// const db2 = new Database("restaurant.sqlite", {});
const { getDb } = require("../common/getDb")
const db2 = getDb()


const assignPrinterToBill = (printerData) => {
	if (printerData.assignType === "bill") {
		db2.prepare("UPDATE printers SET bill_print_orderTypes=?, bill_print_copy_count=? WHERE id=?").run(
			printerData.billPrintOrderTypes,
			printerData.billPrintCopyCount,
			+printerData.printerId
		);
	} else {
		// console.log(printerData);
		db2.prepare("UPDATE printers SET kot_print_orderTypes=?, kot_print_copy_count=? WHERE id=?").run(
			printerData.kotPrintOrderTypes,
			printerData.kotPrintCopyCount,
			+printerData.printerId
		);
	}
};

module.exports = { assignPrinterToBill };
