const getVariation = (item, db) => {
	// get variation for each item from Item_variation(pivot) and variations table

	return new Promise((res, rej) => {
		db.all(
			"SELECT item_variation.variation_id,item_variation.id as item_variation_id, item_variation.price, variations.name ,variations.display_name FROM item_variation JOIN variations ON item_variation.variation_id=variations.id WHERE item_variation.item_id=? AND item_variation.status=1 ORDER BY item_variation.priority ASC ",
			[item.id],
			async (err, variations) => {
				if (err) {
					rej(err);
				} else {
					let newVariations = await Promise.all(
						// for each variations get addonGroups using addongroups and addongroup_item_variation table.

						variations.map(variation => {
							return new Promise((res, rej) => {
								db.all(
									"SELECT addongroups.id AS addongroup_id, addongroups.name,addongroups.display_name FROM addongroups JOIN addongroup_item_variation ON addongroup_item_variation.addongroup_id=addongroups.id WHERE addongroup_item_variation.item_variation_id=? AND addongroups.status=1 ORDER BY addongroups.priority ASC ",
									[variation.item_variation_id],
									async (err, addonGroups) => {
										if (err) {
											rej(err);
										} else {
											let newAddonGroups = await Promise.all(
												// for each addonGroups get addonItems using addongroupitems table.

												addonGroups.map(group => {
													return new Promise((res, rej) => {
														db.all(
															"SELECT id,attribute,addongroup_id,name,display_name,price FROM addongroupitems WHERE addongroup_id=? AND status=1 ORDER BY priority ASC",
															[group.addongroup_id],
															(err, addonItems) => {
																if (err) {
																	rej(err);
																} else {
																	let newAddonGroups = {
																		...group,
																		addonItems: addonItems,
																	};
																	res(newAddonGroups);
																}
															}
														);
													});
												})
											);

											let newVariation = { ...variation, addonGroups: newAddonGroups };
											res(newVariation);
										}
									}
								);
							});
						})
					);
					newItem = {
						...item,
						price: newVariations[0].price,
						variations: newVariations,
						item_tax: [
							{ id: 3, name: "CGST", tax: 2.5 },
							{ id: 4, name: "SGST", tax: 2.5 },
						],
					};
					res(newItem);
				}
			}
		);
	});
};

//   get items from items table using catagory id provided by API call

const getItems = (id, db) => {
	return new Promise((resolve, reject) => {
		db.all(
			"SELECT id,category_id,name,display_name,attribute,description,is_spicy,has_jain,has_variation,order_type,price,description,has_addon,in_stock,tag FROM items WHERE category_id=? AND status=1 AND restaurant_id=1 ORDER BY priority ASC",
			[id],
			(err, items) => {
				if (err) {
					reject(err);
				} else {
					resolve(items);
				}
			}
		);
	});
};

// to gell all data of catagory from catagory id

// for final build use path.join("resources", "restaurant.sqlite")

const getData = async (id, db) => {
	// const db = new sqlite3.Database("restaurant.sqlite", (err) => {
	//      if (err) {
	//           console.log(err);
	//      }
	// });

	let items = await getItems(id, db);

	// get detail items array with variation and addongroups and addonitems
	let data = await Promise.all(
		items.map(async item => {
			if (item.has_variation == 1) {
				return await getVariation(item, db);
			} else {
				return {
					...item,
					item_tax: [
						{ id: 3, name: "CGST", tax: 2.5 },
						{ id: 4, name: "SGST", tax: 2.5 },
					],
					variations: [],
				};
			}
		})
	);

	return data;
};

// path.join(process.resourcePath, 'extraResources', 'restaurant.sqlite')

const getCategories = async db => {
	return await Promise.resolve(
		new Promise((res, rej) => {
			db.all("SELECT id,restaurant_id,name,display_name,item_count FROM categories WHERE restaurant_id=1 AND status=1", [], async (err, categories) => {
				if (err) {
					rej(err);
				} else {
					// console.log(category)
					// res(categories);

					let bigData = await Promise.all(
						categories.map(async category => {
							return new Promise(async (res, rej) => {
								let items = await getData(category.id, db);
								res({ ...category, items: [...items] });
							});
						})
					);

					res(bigData);
				}
			});
		})
	);
};

module.exports = { getData, getCategories };
