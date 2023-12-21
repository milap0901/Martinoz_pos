// const Database = require("better-sqlite3");
const { getDefaultScreenData } = require("../settings/getDefaultScreenData");

// const db2 = new Database("restaurant.sqlite", {});
// const db2 = new Database("restaurant.sqlite", {});

const { getDb } = require("../common/getDb");
const db2 = getDb();

const getMenuData = data => {
	// const {name,emain,pass} = data
	const categoryPrepare = db2.prepare("SELECT id,restaurant_id,name,display_name,item_count FROM categories WHERE restaurant_id=1 AND status=1");

	const itemsPrepare = db2.prepare(
		"SELECT id,category_id,name,display_name,attribute,description,is_spicy,has_jain,has_variation,order_type,price,description,has_addon,in_stock,tag,item_tax AS tax,price_type,parent_tax FROM items WHERE category_id=? AND status=1 AND restaurant_id=1 ORDER BY priority ASC"
	);

	const taxesPrepare = db2.prepare("SELECT id,name,tax FROM taxes WHERE id=?");

	const variationsPrepare = db2.prepare(
		"SELECT item_variation.variation_id,item_variation.restaurant_price_id as restaurantPriceId,item_variation.id as item_variation_id, item_variation.price, variations.name ,variations.display_name FROM item_variation JOIN variations ON item_variation.variation_id=variations.id WHERE item_variation.item_id=? AND item_variation.status=1 ORDER BY item_variation.priority ASC "
	);

	const addonGroupsPrepare = db2.prepare(
		"SELECT addongroups.id AS addongroup_id, addongroups.name,addongroups.display_name FROM addongroups JOIN addongroup_item_variation ON addongroup_item_variation.addongroup_id=addongroups.id WHERE addongroup_item_variation.item_variation_id=? AND addongroups.status=1 ORDER BY addongroups.priority ASC "
	);

	const addonsPrepare = db2.prepare("SELECT id,attribute,addongroup_id,name,display_name,price FROM addongroupitems WHERE addongroup_id=? AND status=1 ORDER BY priority ASC");

	const areaStmt = db2.prepare("SELECT id,restaurant_id,restaurant_price_id,area FROM areas");

	const dineInTablesStmt = db2.prepare("SELECT * FROM dine_in_tables WHERE restaurant_id= 1 AND area_id=?");

	const restaurantPricesStmt = db2.prepare("SELECT restaurant_price_id,price FROM item_restaurant_prices WHERE item_id=?");

	const areas = areaStmt.all([]);

	const areasWithTable = areas.map(area => {
		const dineInTables = dineInTablesStmt.all([area.id]);
		return { ...area, tables: dineInTables };
	});

	const defaultSettings = getDefaultScreenData();

	const categories = categoryPrepare.all([]);

	const categoriesWithItems = categories.map(category => {
		const items = itemsPrepare.all([category.id]);

		const itemsWithVariations = items.map(item => {
			item.restaurantPrices = restaurantPricesStmt.all([item.id]);
			const itemTaxArray = item.tax ? item.tax.split(",") : [];

			let totalTax = 0;
			item.item_tax = itemTaxArray.map(tax => {
				const taxData = taxesPrepare.get([+tax]);
				totalTax += taxData.tax;
				return taxData;
			});

			if (item.price_type === 1) {
				item.price = item.price / (1 + totalTax / 100);

				item.restaurantPrices = item.restaurantPrices.map(restaurantPrices => {
					return { ...restaurantPrices, price: restaurantPrices.price / (1 + totalTax / 100) };
				});
			}

			if (item.has_variation == 1) {
				const variations = variationsPrepare.all([item.id]);

				const variationsWithAddons = variations.map(variation => {
					const priceWithoutTaxes = item.price_type === 1 ? variation.price / (1 + totalTax / 100) : variation.price;

					const addonGroup = addonGroupsPrepare.all([variation.item_variation_id]);

					const addonGroupWithAddons = addonGroup.map(group => {
						const addons = addonsPrepare.all(group.addongroup_id);

						if (item.price_type === 1) {
							for (const addon of addons) {
								addon.price = addon.price / (1 + totalTax / 100);
							}
						}

						return { ...group, addonItems: addons };
					});

					return { ...variation, addonGroups: addonGroupWithAddons, price: priceWithoutTaxes };
				});

				return {
					...item,
					variations: variationsWithAddons,
				};
			} else {
				return {
					...item,
					variations: [],
				};
			}
		});

		return { ...category, items: itemsWithVariations };
	});

	return { categories: categoriesWithItems, areas: areasWithTable, defaultSettings };
};

// const getMenuData = () => {
//       const prepareQuery = db2.prepare(`
//     SELECT
//       c.id AS category_id,
//       c.restaurant_id,
//       c.name AS category_name,
//       c.display_name AS category_display_name,
//       c.item_count,
//       i.id AS item_id,
//       i.name AS item_name,
//       i.display_name AS item_display_name,
//       i.attribute,
//       i.description AS item_description,
//       i.is_spicy,
//       i.has_jain,
//       i.has_variation,
//       i.order_type,
//       i.price,
//       i.description,
//       i.has_addon,
//       i.in_stock,
//       i.tag,
//       iv.id AS item_variation_id,
//       iv.price AS item_variation_price,
//       v.name AS variation_name,
//       v.display_name AS variation_display_name,
//       ag.id AS addongroup_id,
//       ag.name AS addongroup_name,
//       ag.display_name AS addongroup_display_name,
//       agi.attribute AS addon_attribute,
//       agi.name AS addon_name,
//       agi.display_name AS addon_display_name,
//       agi.price AS addon_price
//     FROM
//       categories c
//       LEFT JOIN items i ON c.id = i.category_id AND i.status = 1 AND i.restaurant_id = 1
//       LEFT JOIN item_variation iv ON i.id = iv.item_id AND iv.status = 1
//       LEFT JOIN variations v ON iv.variation_id = v.id
//       LEFT JOIN addongroup_item_variation agiv ON iv.id = agiv.item_variation_id
//       LEFT JOIN addongroups ag ON agiv.addongroup_id = ag.id AND ag.status = 1
//       LEFT JOIN addongroupitems agi ON ag.id = agi.addongroup_id AND agi.status = 1
//     WHERE
//       c.restaurant_id = 1 AND c.status = 1
//     ORDER BY
//       c.id ASC, i.priority ASC, iv.priority ASC, ag.priority ASC, agi.priority ASC
//   `);

//       const rows = prepareQuery.all([]);
//       const categories = {};

//       rows.forEach((row) => {
//             const categoryId = row.category_id;

//             if (!categories[categoryId]) {
//                   categories[categoryId] = {
//                         id: categoryId,
//                         restaurant_id: row.restaurant_id,
//                         name: row.category_name,
//                         display_name: row.category_display_name,
//                         item_count: row.item_count,
//                         items: [],
//                   };
//             }

//             if (row.item_id) {
//                   const itemId = row.item_id;

//                   if (!categories[categoryId].items.find((item) => item.id === itemId)) {
//                         const item = {
//                               id: itemId,
//                               name: row.item_name,
//                               display_name: row.item_display_name,
//                               attribute: row.attribute,
//                               description: row.item_description,
//                               is_spicy: row.is_spicy,
//                               has_jain: row.has_jain,
//                               has_variation: row.has_variation,
//                               order_type: row.order_type,
//                               price: row.price,
//                               description: row.description,
//                               has_addon: row.has_addon,
//                               in_stock: row.in_stock,
//                               tag: row.tag,
//                               variations: [],
//                               item_tax: [
//                                     { id: 3, name: "CGST", tax: 2.5 },
//                                     { id: 4, name: "SGST", tax: 2.5 },
//                               ],
//                         };

//                         categories[categoryId].items.push(item);
//                   }

//                   if (row.item_variation_id) {
//                         const variation = {
//                               id: row.item_variation_id,
//                               price: row.item_variation_price,
//                               name: row.variation_name,
//                               display_name: row.variation_display_name,
//                               addonGroups: [],
//                         };

//                         const item = categories[categoryId].items.find((item) => item.id === itemId);
//                         item.variations.push(variation);
//                   }

//                   if (row.addongroup_id) {
//                         const addonGroup = {
//                               id: row.addongroup_id,
//                               name: row.addongroup_name,
//                               display_name: row.addongroup_display_name,
//                               addonItems: [],
//                         };

//                         const variation = categories[categoryId].items.find((item) => item.id === itemId).variations.find((variation) => variation.id === row.item_variation_id);

//                         variation.addonGroups.push(addonGroup);
//                   }

//                   if (row.addon_name) {
//                         const addon = {
//                               id: row.addon_id,
//                               attribute: row.addon_attribute,
//                               name: row.addon_name,
//                               display_name: row.addon_display_name,
//                               price: row.addon_price,
//                         };

//                         const addonGroup = categories[categoryId].items
//                               .find((item) => item.id === itemId)
//                               .variations.find((variation) => variation.id === row.item_variation_id)
//                               .addonGroups.find((group) => group.id === row.addongroup_id);

//                         addonGroup.addonItems.push(addon);
//                   }
//             }
//       });

//       return Object.values(categories);
// };

module.exports = { getMenuData };
