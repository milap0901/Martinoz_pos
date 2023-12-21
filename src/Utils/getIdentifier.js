export const getIdentifier = (itemId, variation_id, toppings) => {
	// let { itemId, variation_id, toppings } = item;
	let identifier = [];
	identifier.push(itemId);
	if (variation_id) {
		identifier.push(variation_id);
	}

	if (toppings.length) {
		toppings
			.slice()
			.sort((a, b) => {
				return a.id - b.id;
			})
			.forEach(topping => {
				identifier.push(topping.id);
				identifier.push(topping.quantity);
			});
	}
	return identifier.join("_");
};
