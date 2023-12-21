export const getIndividualKots = (order, newKotTokenNo) => {
	const allKots = [];

	const existingKots = order.kotsDetail.map(kot => {
		// const existingKotItems = order.orderCart.filter(item => item.kotId === kot.id);
		let isModified = false;
		const existingKotItems = order.orderCart.reduce((cart, item) => {
			if (item.kotId === kot.id) {
				cart.push(item);
			}

			if (item.itemStatus !== "default" || item.itemStatus !== "new") {
				isModified = true;
			}
			return cart;
		}, []);

		return { ...order, id: kot.id, kotTokenNo: kot.token_no, orderCart: existingKotItems, isModified };
	});

	allKots.push(...existingKots);

	const newKotItems = order.orderCart.filter(item => item.itemStatus === "new");

	if (newKotItems.length) {
		const newKot = { ...order, kotTokenNo: newKotTokenNo, orderCart: newKotItems, isModified: false };
		allKots.push(newKot);
	}

	return allKots;
};
