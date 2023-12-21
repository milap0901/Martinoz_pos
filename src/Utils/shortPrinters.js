const sortPrinters = printers => {
	return printers.map(printer => {
		// const kotPrintCategories =  printer.kot_print_categories.split

		const billPrintOrderTypes = printer.bill_print_ordertypes.length
			? printer.bill_print_ordertypes.split(",")?.map(orderType => {
					if (orderType === "1") {
						return { orderType: "delivery", copyCount: +printer.bill_print_copy_count.split(",")[0] };
					}
					if (orderType === "2") {
						return { orderType: "dine_in", copyCount: +printer.bill_print_copy_count.split(",")[1] };
					}
					if (orderType === "3") {
						return { orderType: "pick_up", copyCount: +printer.bill_print_copy_count.split(",")[2] };
					} else return {};
			  })
			: [];

		const kotPrintOrderTypes = printer.kot_print_ordertypes.length
			? printer.kot_print_ordertypes.split(",")?.map(orderType => {
					if (orderType === "1") {
						return { orderType: "delivery", copyCount: +printer.kot_print_copy_count.split(",")[0] };
					}
					if (orderType === "2") {
						return { orderType: "dine_in", copyCount: +printer.kot_print_copy_count.split(",")[1] };
					}
					if (orderType === "3") {
						return { orderType: "pick_up", copyCount: +printer.kot_print_copy_count.split(",")[2] };
					} else return {};
			  })
			: [];

		return {
			printerName: printer.printer_name,
			displayName: printer.printer_display_name,
			billPrintOrderTypes,
			kotPrintOrderTypes,
			kotPrintStatus: printer.kot_print_status,
			billPrintStatus: printer.bill_print_status,
			kotPrintCategories: printer.kot_print_categories,
			kotPrintItems: printer.kot_print_items,
		};
	});
};

export default sortPrinters;
