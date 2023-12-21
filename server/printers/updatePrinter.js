// const Database = require("better-sqlite3");
// const db2 = new Database("restaurant.sqlite", {});

const { getDb } = require("../common/getDb")
const db2 = getDb()


const updatePrinter = (data) => {
	console.log(data);

	const billPrintStatus = data.assignToBillStatus ? 1 : 0;
	const kotPrintStatus = data.assignToKotStatus ? 1 : 0;
	db2.prepare(
		"UPDATE printers SET printer_name=?, printer_display_name=?,bill_print_status=?, bill_print_ordertypes=?, bill_print_copy_count=?, kot_print_status=?, kot_print_ordertypes=?, kot_print_copy_count=?,printer_type=?,kot_print_categories=?,kot_print_items=? where id=?"
	).run([
		data.selectedPrinter,
		data.printer_display_name,
		billPrintStatus,
		data.billPrintOrderTypes,
		data.billPrintCopyCount,
		kotPrintStatus,
		data.kotPrintOrderTypes,
		data.kotPrintCopyCount,
		data.printerType,
		data.printCategories.toString(),
		data.printItems.toString(),
		data.id,
	]);
};

module.exports = { updatePrinter };
