export const matchOrderAndKotsWithTables = (orders = [], areas = [], kots = []) => {
	// console.log(kots)
	const listedTableNo = []; // to list all the tables available in database

	const areasWithOrders = areas?.map(area => {
		const updatedTableWithOrder = [];

		area.tables.forEach(table => {
			listedTableNo.push(table.table_no);

			const orderOnTable = orders?.filter(order => order.order_type === "dine_in" && order.dine_in_table_no === table.table_no);

			const kotOnTable = kots?.filter(kot => kot.order_type === "dine_in" && kot.table_no.toString() === table.table_no.toString() && kot.pos_order_id === null);

			if (orderOnTable.length) {
				updatedTableWithOrder.push({ ...table, orders: orderOnTable, type: "order" });
			}

			if (kotOnTable.length) {
				updatedTableWithOrder.push({ ...table, orders: kotOnTable, type: "kot" });
			}

			if (!kotOnTable.length && !orderOnTable.length) updatedTableWithOrder.push({ ...table, orders: [], type: "none" });
		});

		// const updatedTableWithOrder = area.tables.map(table => {
		// 	listedTableNo.push(table.table_no);

		// 	const orderOnTable = orders?.filter(order => order.order_type === "dine_in" && order.dine_in_table_no === table.table_no);

		// 	const kotOnTable = kots?.filter(kot => kot.order_type === "dine_in" && kot.table_no.toString() === table.table_no.toString() && kot.order_id === null);

		// 	if (orderOnTable.length) {
		// 		return { ...table, orders: orderOnTable, type: "order" };
		// 	}

		// 	if (kotOnTable.length) {
		// 		return { ...table, orders: kotOnTable, type: "kot" };
		// 	}

		// 	return { ...table, orders: [], type: "none" };
		// });

		return { ...area, tables: updatedTableWithOrder };
	});

	const otherOrders = orders.filter(order => order.order_type === "dine_in" && !listedTableNo.includes(order.dine_in_table_no));

	const otherKots = kots.filter(kot => kot.order_type === "dine_in" && kot.pos_order_id === null && !listedTableNo.includes(kot.table_no.toString()));

	const otherTableKots = [];

	otherKots.forEach(kot => {
		const existingTableKot = otherTableKots.find(otherTableKot => otherTableKot.table_no.toString() === kot.table_no.toString());

		if (existingTableKot) {
			existingTableKot.orders.push(kot);
		} else {
			const newOtherTableKot = { id: +kot.id, table_no: kot.table_no.toString(), area_id: areas.length + 1, orders: [kot], type: "kot" };
			otherTableKots.push(newOtherTableKot);
		}
	});

	const otherTablesOrders = otherOrders.map(order => {
		return { id: +order.id, table_no: order.dine_in_table_no.toString(), area_id: areas.length + 1, orders: [order], type: "order" };
	});

	const otherArea = {
		id: areas.length + 1,
		restaurant_id: 1,
		restaurant_price_id: 4,
		area: "Other Tables",
		tables: [...otherTablesOrders, ...otherTableKots],
	};

	return [...areasWithOrders, otherArea];
};
