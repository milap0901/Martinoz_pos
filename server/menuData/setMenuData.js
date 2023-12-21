const Database = require("better-sqlite3");
const axios = require("axios");
// const db3 = new Database("restaurant.sqlite", {});
// const db2 = new Database("./server/restaurant.sqlite",{})

const { getDb } = require("../common/getDb")
const db2 = getDb()

const martinozUrl = "https://martinozpizza.emergingcoders.com/api/pos/v1"
const jillUrl = "https://restoapi.emergingcoders.com/api/pos/v1"

const setMenuData = async (token,syncCode) => {
	
	let start = Date.now();
	var options = {
		method: "POST",
		url: `${jillUrl}/get-menu`,
		headers: {
			Accept: "*/*",
			"User-Agent": "Thunder Client (https://www.thunderclient.com)",
			Authorization: `Bearer ${token}`,
			"content-type": "multipart/form-data; boundary=---011000010111000001101001",
		},
		data: {restaurant_code:syncCode}
	};
	try {
	const { data: menu } = await axios(options);


	const {
		categories,
		order_types,
		variations,
		restaurant,
		addongroups,
		items,
		addongroup_item_variations,
		taxes,
		dine_in_tables,
		groups,
		prices,
		restaurant_prices,
		orders,
		brand,
		attributes,
	} = menu.data;

	
		const categorystmt = db2.prepare(
			"INSERT INTO categories (id,restaurant_id,main_category_id,parent_cat_id,name,display_name,image,call_to_action,bogo_item,sio,item_count,priority,status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)"
		);

		const variationstmt = db2.prepare(
			"INSERT INTO variations (id,restaurant_id,main_variation_id,name,display_name,groupname,bogo_item,sio,status,pp_id) VALUES(?,?,?,?,?,?,?,?,?,?)"
		);

		const restaurantstmt = db2.prepare(
			"INSERT INTO restaurants (id, user_id, name, legal_entity_name, gstin,address, contact,latitude, longitude, landmark, city_id, state_id, start_time, end_time, delivery_start_time1, delivery_end_time1, delivery_start_time2, delivery_end_time2,serviceable_radius, min_order_amt_for_free_delivery, delivery_charges_below_min_amount, min_order_amt_delivery, min_order_amt_pickup, min_order_amt_dinein, new_order_alert_number, has_extra_charges_for_delivery_per_km, normal_delivery_radius, extra_charges_per_km, accepting_delivery, accepting_pickup, accepting_dinein, cod_limit_pickup, cod_limit_delivery, cod_limit_dinein, cod_for_failed_payment, cod_fp_delivery, cod_fp_pickup, cod_fp_dinein, cod_for_failed_payment_limit, cod_delivery, cod_pickup, cod_dinein, op_delivery, op_pickup, op_dinein, pp_restaurant_code, menu_version, fssai_lic_number, has_dinein, ask_table_no, is_table_no_optional, pg_account_id, status, opening_date, image) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
		);

		const addongroupstmt = db2.prepare("INSERT INTO addongroups (id,restaurant_id,main_addongroup_id,name,display_name,priority,status,pp_id) VALUES (?,?,?,?,?,?,?,?)");

		const addonItemstmt = db2.prepare("INSERT INTO addongroupitems (id,attribute,addongroup_id,name,display_name,price,status,priority,pp_id) VALUES (?,?,?,?,?,?,?,?,?)");

		const itemstmt = db2.prepare(
			"INSERT INTO items (id,restaurant_id, main_item_id, category_id, name, display_name, attribute, description, is_spicy, has_jain, tag, image, pp_image_url, status, priority, has_variation, order_type, packing_charges, has_addon, has_variation_addon, in_stock, suggest, in_stock_turn_on_time, variation_groupname, price, item_tax, bogo_item, pp_id) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
		);

		const itemVariationstmt = db2.prepare("INSERT INTO item_variation (id,item_id,variation_id,price,restaurant_price_id) VALUES (?,?,?,?,?)");

		const itemRestaurantPricesstmt = db2.prepare("INSERT INTO item_restaurant_prices (item_id,restaurant_price_id,price,status) VALUES (?,?,?,?)");

		const addonItemVariationstmt = db2.prepare("INSERT INTO addongroup_item_variation (id,addongroup_id,item_variation_id) VALUES (?,?,?) ");

		const taxstmt = db2.prepare("INSERT INTO taxes (id,restaurant_id,main_tax_id,name,tax,order_types,status,priority,pp_id) VALUES (?,?,?,?,?,?,?,?,?)");

		const dineInTablestmt = db2.prepare("INSERT INTO dine_in_tables (id,restaurant_id,area_id,uid,sid,table_no,qr_code,platform) VALUES (?,?,?,?,?,?,?,?)");

		const groupstmt = db2.prepare("INSERT INTO groups (id,name,permissions) VALUES (?,?,?)");

		const userstmt = db2.prepare("INSERT INTO users (id,name,number,otp,email,pg_cust_id,email_verified_at,activated) VALUES (?,?,?,?,?,?,?,?)");

		const userGroupstmt = db2.prepare("INSERT INTO users_groups (user_id,group_id) VALUES (?,?) ");

		const pricesstms = db2.prepare("INSERT INTO prices (id,name,type,status,created_at,updated_at) VALUES(?,?,?,?,?,?)");

		const restaurantPricesstmt = db2.prepare("INSERT INTO restaurant_prices (id,price_id,restaurant_id,display_name,status,created_at,updated_at) VALUES (?,?,?,?,?,?,?)");

		const orderTypestmt = db2.prepare("INSERT INTO order_types (id,name,status) VALUES(?,?,?)");

		const orderstmt = db2.prepare(
			"INSERT INTO orders (id, user_id ,order_number ,restaurant_id ,customer_name ,complete_address,delivery_lat,delivery_long,delivery_distance,aerial_distance,normal_delivery_radius,rider_id,phone_number,city_id,pincode,user_address_id,order_type,dine_in_table_id,dine_in_table_no,description,item_total,total_discount,total_tax,delivery_charges,total,promo_id,promo_code,promo_discount,platform,app_version,payment_type,order_status,reason,pp_order_json,ordered_at,pg_order_id,pg_payment_id,created_at,updated_at,user_paid,settle_amount,print_count,tip) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
		);

		const orderItemstmt = db2.prepare(
			"INSERT INTO order_items (id,order_id,item_id,item_name,item_discount,price,final_price,quantity,description,variation_name,variation_id,contains_free_item,main_order_item_id,created_at,updated_at,item_addon_items) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
		);

		const orderItemTaxesstmt = db2.prepare("INSERT INTO order_item_taxes (id,order_item_id,tax_id,tax,tax_amount,created_at,updated_at) VALUES (?,?,?,?,?,?,?)");

		const brandsstmt = db2.prepare(`
            INSERT INTO brands ( id, uid, user_id, name, logo, primary_color, secondary_color, extra_light_color, h_desc, h_img, insta_url, fb_url, youtube_url, android_app_link, ios_app_link, app_ss, h_bg_img, is_our_story, our_story_img, our_story_desc, location, support_email, support_phone, is_fe, fe_phone, fe_email, fe_banner_img, domain, terms_and_conditions, refund_policy, faqs, terms_and_conditions_link,refund_policy_link, help_and_support_link, faqs_link, franchise_enquiry_link, pg_default_email, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

		const attributesstmt = db2.prepare(`INSERT INTO attributes (id, name, status, pp_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)`);


		db2.transaction(() => {
			// restaurantstmt.run(
			// 	restaurant.id,
			// 	restaurant.user_id,
			// 	restaurant.name,
			// 	restaurant.legal_entity_name,
			// 	restaurant.gstin,
			// 	restaurant.address,
			// 	restaurant.contact,
			// 	restaurant.latitude,
			// 	restaurant.longitude,
			// 	restaurant.landmark,
			// 	restaurant.city_id,
			// 	restaurant.state_id,
			// 	restaurant.start_time,
			// 	restaurant.end_time,
			// 	restaurant.delivery_start_time1,
			// 	restaurant.delivery_end_time1,
			// 	restaurant.delivery_start_time2,
			// 	restaurant.delivery_end_time2,
			// 	restaurant.serviceable_radius,
			// 	restaurant.min_order_amt_for_free_delivery,
			// 	restaurant.delivery_charges_below_min_amount,
			// 	restaurant.min_order_amt_delivery,
			// 	restaurant.min_order_amt_pickup,
			// 	restaurant.min_order_amt_dinein,
			// 	restaurant.new_order_alert_number,
			// 	restaurant.has_extra_charges_for_delivery_per_km,
			// 	restaurant.normal_delivery_radius,
			// 	restaurant.extra_charges_per_km,
			// 	restaurant.accepting_delivery,
			// 	restaurant.accepting_pickup,
			// 	restaurant.accepting_dinein,
			// 	restaurant.cod_limit_pickup,
			// 	restaurant.cod_limit_delivery,
			// 	restaurant.cod_limit_dinein,
			// 	restaurant.cod_for_failed_payment,
			// 	restaurant.cod_fp_delivery,
			// 	restaurant.cod_fp_pickup,
			// 	restaurant.cod_fp_dinein,
			// 	restaurant.cod_for_failed_payment_limit,
			// 	restaurant.cod_delivery,
			// 	restaurant.cod_pickup,
			// 	restaurant.cod_dinein,
			// 	restaurant.op_delivery,
			// 	restaurant.op_pickup,
			// 	restaurant.op_dinein,
			// 	restaurant.pp_restaurant_code,
			// 	restaurant.menu_version,
			// 	restaurant.fssai_lic_number,
			// 	restaurant.has_dinein,
			// 	restaurant.ask_table_no,
			// 	restaurant.is_table_no_optional,
			// 	restaurant.pg_account_id,
			// 	restaurant.status,
			// 	restaurant.opening_date,
			// 	restaurant.image
			// );

			for (const orderType of order_types) {
				orderTypestmt.run(orderType.id, orderType.name, orderType.status);
			}

			for (const price of prices) {
				pricesstms.run(price.id, price.name, price.type, price.status, price.created_at, price.updated_at);
			}

			for (const attribute of attributes) {
				attributesstmt.run(attribute.id, attribute.name, attribute.status, attribute.pp_id, attribute.created_at, attribute.updated_at);
			}

			brandsstmt.run(
				brand.id,
				brand.uid,
				brand.user_id,
				brand.name,
				brand.logo,
				brand.primary_color,
				brand.secondary_color,
				brand.extra_light_color,
				brand.h_desc,
				brand.h_img,
				brand.insta_url,
				brand.fb_url,
				brand.youtube_url,
				brand.android_app_link,
				brand.ios_app_link,
				brand.app_ss,
				brand.h_bg_img,
				brand.is_our_story,
				brand.our_story_img,
				brand.our_story_desc,
				brand.location,
				brand.support_email,
				brand.support_phone,
				brand.is_fe,
				brand.fe_phone,
				brand.fe_email,
				brand.fe_banner_img,
				brand.domain,
				brand.terms_and_conditions,
				brand.refund_policy,
				brand.faqs,
				brand.terms_and_conditions_link,
				brand.refund_policy_link,
				brand.help_and_support_link,
				brand.faqs_link,
				brand.franchise_enquiry_link,
				brand.pg_default_email,
				brand.status,
				brand.created_at,
				brand.updated_at
			);

			for (const restaurant_price of restaurant_prices) {
				restaurantPricesstmt.run(
					restaurant_price.id,
					restaurant_price.price_id,
					restaurant_price.restaurant_id,
					restaurant_price.display_name,
					restaurant_price.status,
					restaurant_price.created_at,
					restaurant_price.updated_at
				);
			}

			for (const tax of taxes) {
				taxstmt.run(tax.id, tax.restaurant_id, tax.main_tax_id, tax.name, tax.tax, tax.order_types, tax.status, tax.priority, tax.pp_id);
			}

			for (const category of categories) {
				categorystmt.run(
					category.id,
					category.restaurant_id,
					category.main_category_id,
					category.parent_cat_id,
					category.name,
					category.display_name,
					category.image,
					category.call_to_action,
					category.bogo_item,
					category.sio,
					category.item_count,
					category.priority,
					category.status
				);
			}

			for (const variation of variations) {
				variationstmt.run(
					variation.id,
					variation.restaurant_id,
					variation.main_variation_id,
					variation.name,
					variation.display_name,
					variation.groupname,
					variation.bogo_item,
					variation.sio,
					variation.status,
					variation.pp_id
				);
			}

			for (const addongroup of addongroups) {
				addongroupstmt.run(
					addongroup.id,
					addongroup.restaurant_id,
					addongroup.main_addongroup_id,
					addongroup.name,
					addongroup.display_name,
					addongroup.priority,
					addongroup.status,
					addongroup.pp_id
				);

				db2.transaction(() => {
					for (const addonitem of addongroup.addongroupitems) {
						addonItemstmt.run(
							addonitem.id,
							addonitem.attribute,
							addonitem.addongroup_id,
							addonitem.name,
							addonitem.display_name,
							addonitem.price,
							addonitem.status,
							addonitem.priority,
							addonitem.pp_id
						);
					}
				})();
			}

			for (const item of items) {
				itemstmt.run(
					item.id,
					item.restaurant_id,
					item.main_item_id,
					item.category_id,
					item.name,
					item.display_name,
					item.attribute,
					item.description,
					item.is_spicy,
					item.has_jain,
					item.tag,
					item.image,
					item.pp_image_url,
					item.status,
					item.priority,
					item.has_variation,
					item.order_type,
					item.packing_charges,
					item.has_addon,
					item.has_variation_addon,
					item.in_stock,
					item.suggest,
					item.in_stock_turn_on_time,
					item.variation_groupname,
					item.price,
					item.item_tax,
					item.bogo_item,
					item.pp_id
				);

				if (item.variations.length) {
					db2.transaction(() => {
						for (const itemVariation of item.variations) {
							itemVariationstmt.run(
								itemVariation.pivot.id,
								itemVariation.pivot.item_id,
								itemVariation.pivot.variation_id,
								itemVariation.pivot.price,
								itemVariation.pivot.restaurant_price_id
							);
						}
					})();
				}

				if (item.restaurantprices.length) {
					db2.transaction(() => {
						for (const restaurantPrice of item.restaurantprices) {
							itemRestaurantPricesstmt.run(
								restaurantPrice.pivot.item_id,
								restaurantPrice.pivot.restaurant_price_id,
								restaurantPrice.pivot.price,
								restaurantPrice.pivot.status
							);
						}
					})();
				}
			}

			for (const order of orders) {

				orderstmt.run(
					order.id,
					order.user_id,
					order.order_number,
					order.restaurant_id,
					order.customer_name,
					order.complete_address,
					order.delivery_lat,
					order.delivery_long,
					order.delivery_distance,
					order.aerial_distance,
					order.normal_delivery_radius,
					order.rider_id,
					order.phone_number,
					order.city_id,
					order.pincode,
					order.user_address_id,
					order.order_type,
					order.dine_in_table_id,
					order.dine_in_table_no,
					order.description,
					order.item_total,
					order.total_discount,
					order.total_tax,
					order.delivery_charges,
					order.total,
					order.promo_id,
					order.promo_code,
					order.promo_discount,
					order.platform,
					order.app_version,
					order.payment_type,
					order.order_status,
					order.reason,
					order.pp_order_json,
					order.ordered_at,
					order.pg_order_id,
					order.pg_payment_id,
					order.created_at,
					order.updated_at,
					order.total,
					order.total,
					1,
					0
				);

				db2.transaction(() => {
					for (const item of order.orderitems) {
						const item_addons = item.orderitemaddongroupitems.length ? JSON.stringify(item.orderitemaddongroupitems) : null;

						orderItemstmt.run(
							item.id,
							item.order_id,
							item.item_id,
							item.item_name,
							item.item_discount,
							item.price,
							item.final_price,
							item.quantity,
							item.description,
							item.variation_name,
							item.variation_id,
							item.contains_free_item,
							item.main_order_item_id,
							item.created_at,
							item.updated_at,
							item_addons
						);

						db2.transaction(() => {
							for (const tax of item.orderitemtaxes) {
								orderItemTaxesstmt.run(tax.id, tax.order_item_id, tax.tax_id, tax.tax, tax.tax_amount, tax.created_at, tax.updated_at);
							}
						})();
					}
				})();
			}

			for (const addonVariation of addongroup_item_variations) {
				addonItemVariationstmt.run(addonVariation.id, addonVariation.addongroup_id, addonVariation.item_variation_id);
			}

			for (const table of dine_in_tables) {
				dineInTablestmt.run(table.id, table.restaurant_id, table.area_id, table.uid, table.sid, table.table_no, table.qr_code, table.platform);
			}

			for (const group of groups) {
				groupstmt.run(group.id, group.name, group.permissions);
			}
		})();


		let i = 1;
		let hasData = true;
		let allCustomers = [];

		while (hasData) {
			// let start = Date.now();
			let options = {
				method: "POST",
				url: `${jillUrl}/get-customers`,
				headers: {
					Accept: "*/*",
					"User-Agent": "Thunder Client (https://www.thunderclient.com)",
					Authorization: `Bearer ${token}`,
					"content-type": "multipart/form-data; boundary=---011000010111000001101001",
				},
				data: { restaurant_code: syncCode, page: i },
			};

			const {
				data: { data: customers },
			} = await axios(options);
			allCustomers = [...allCustomers, ...customers];

			if (customers.length < 2000) {
				db2.transaction(() => {
					for (const customer of allCustomers) {
						userstmt.run(
							customer.id,
							customer.name,
							customer.number,
							customer.otp,
							customer.email,
							customer.pg_cust_id,
							customer.email_varified_at,
							customer.activated
						);
						userGroupstmt.run(customer.id, customer.group_id);
					}
				})();
				hasData = false;
				let timeTaken = Date.now() - start;
				console.log("Total time taken : " + timeTaken + " milliseconds");
			}

			i++;
		}

		// async function fetchData(pageNumber) {
		//       const options = {
		//             method: "POST",
		//             url: "https://martinozpizza.emergingcoders.com/api/pos/v1/get-customers",
		//             headers: {
		//                   Accept: "*/*",
		//                   "User-Agent": "Thunder Client (https://www.thunderclient.com)",
		//                   Authorization: "Bearer cAvQwn2tjnS8ynb9",
		//                   "content-type": "multipart/form-data; boundary=---011000010111000001101001",
		//             },
		//             data: { restaurant_code: 1, page: pageNumber },
		//       };

		//       const response = await axios(options);
		//       const customers = response.data.data;

		//       return customers;
		// }

		// async function saveData(customers) {
		//       db2.transaction(() => {
		//             for (const customer of customers) {
		//                   userstmt.run(
		//                         customer.id,
		//                         customer.name,
		//                         customer.number,
		//                         customer.otp,
		//                         customer.email,
		//                         customer.pg_cust_id,
		//                         customer.email_varified_at,
		//                         customer.activated
		//                   );

		//                   userGroupstmt.run(customer.id, customer.group_id);
		//             }
		//       })();
		// }

		// async function fetchDataAndSaveData(pageNumber) {
		//       const customers = await fetchData(pageNumber);

		//       console.log(customers.length);
		//       if (!customers.length) {
		//             return false;
		//       }

		//       await saveData(customers);
		//       return true;
		// }

		// async function fetchDataAndSaveConcurrently() {
		//       let i = 1;
		//       let hasData = true;
		//       const promises = [];

		//       while (hasData) {
		//             const promise = fetchDataAndSaveData(i);
		//             promises.push(promise);

		//             i++;
		//             hasData = await promise;
		//       }

		//       await Promise.all(promises);
		// }

		// fetchDataAndSaveConcurrently().then(() => {
		//       console.log("completed");
		//       let timeTaken = Date.now() - start;
		//       console.log("Total time taken : " + timeTaken + " milliseconds");
		// });
		
         db2.prepare("UPDATE startup_config set sync_code=? WHERE id=?").run(syncCode,1)
		return {data:{},statusText:"OK",status:200,err:null}
	} catch (err) {
		console.log(err)
		return {data:{},statusText:"error",statusCode:400,err}
	
	}
};

module.exports = { setMenuData };

// DELETE FROM categories;
// DELETE FROM variations;
// DELETE FROM restaurants;
// DELETE FROM addongroups;
// DELETE FROM addongroupitems;
// DELETE FROM addongroup_item_variation;
// DELETE FROM items;
// DELETE FROM item_variation;
// DELETE FROM taxes;
// DELETE FROM dine_in_tables;
// DELETE FROM groups;
// DELETE FROM users;
// DELETE FROM users_groups;
// DELETE FROM prices;
// DELETE FROM restaurant_prices;
// DELETE FROM order_types;
// DELETE FROM item_restaurant_prices;
// DELETE FROM orders;
// DELETE FROM order_item_addongroupitems;
// DELETE FROM order_item_taxes;
// DELETE FROM order_items;
// DELETE FROM brands;
// DELETE FROM attributes;