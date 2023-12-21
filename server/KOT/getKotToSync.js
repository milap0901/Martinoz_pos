const { getDb } = require("../common/getDb");
const db2 = getDb();

const getKotToSync = () => {
	// const kotsWithOrder = db2.prepare(
	// 	"SELECT K.id, O.web_id AS order_id, C.web_id AS customer_id, K.restaurant_id, K.token_no, K.order_type, K.customer_name, K.phone_number, K.address, K.landmark, K.table_id, K.table_no, K.print_count, K.created_at, K.Updated_at, K.kot_status, K.description, K.web_id FROM kot AS K JOIN pos_orders AS O ON K.pos_order_id = O.id JOIN customers AS C ON K.customer_id = C.id WHERE K.customer_id IS NOT NULL AND K.pos_order_id IS NOT NULL AND C.web_id IS NOT NULL AND O.web_id IS NOT NULL AND K.sync = 0"
	// );

	// const kotsWithoutOrderWithCustomer = db2.prepare(
	// 	"SELECT K.id, K.pos_order_id, C.web_id AS customer_id, K.restaurant_id, K.token_no, K.order_type, K.customer_name, K.phone_number, K.address, K.landmark, K.table_id, K.table_no, K.print_count, K.created_at, K.updated_at, K.kot_status, K.description, K.web_id FROM kot AS K JOIN customers AS C ON K.customer_id = C.id WHERE K.customer_id IS NOT NULL AND K.pos_order_id IS NULL AND C.web_id IS NOT NULL AND K.sync = 0"
	// );

	// const kotsWithoutOrderWithoutCustomer = db2.prepare(
	// 	"SELECT id, pos_order_id, customer_id, restaurant_id, token_no, order_type, customer_name, phone_number, address, landmark, table_id, table_no, print_count, created_at, updated_at, kot_status, description, web_id FROM kot WHERE customer_id IS NULL AND pos_order_id IS NULL AND sync = 0"
	// );

	// console.log("get KOT to sync ran");

	const kots = db2
		.prepare(
			`
    SELECT
      K.id,
      O.web_id AS order_id,
      C.web_id AS customer_id,
      K.restaurant_id,
      K.token_no,
      K.order_type,
      K.customer_name,
      K.phone_number,
      K.address,
      K.landmark,
      K.table_id,
      K.table_no,
      K.print_count,
      K.created_at,
      K.updated_at,
      K.kot_status,
      K.description,
      K.web_id
    FROM
      kot AS K
      JOIN pos_orders AS O ON K.pos_order_id = O.id
      JOIN customers AS C ON K.customer_id = C.id
    WHERE
      K.customer_id IS NOT NULL
      AND K.pos_order_id IS NOT NULL
      AND C.web_id IS NOT NULL
      AND O.web_id IS NOT NULL
      AND K.sync = 0
     
    UNION
  
    SELECT
      K.id,
      K.pos_order_id AS order_id,
      C.web_id AS customer_id,
      K.restaurant_id,
      K.token_no,
      K.order_type,
      K.customer_name,
      K.phone_number,
      K.address,
      K.landmark,
      K.table_id,
      K.table_no,
      K.print_count,
      K.created_at,
      K.updated_at,
      K.kot_status,
      K.description,
      K.web_id
    FROM
      kot AS K
      JOIN customers AS C ON K.customer_id = C.id
    WHERE
      K.customer_id IS NOT NULL
      AND K.pos_order_id IS NULL
      AND C.web_id IS NOT NULL
      AND K.sync = 0
    
    UNION
  
    SELECT
      id,
      pos_order_id AS order_id,
      customer_id,
      restaurant_id,
      token_no,
      order_type,
      customer_name,
      phone_number,
      address,
      landmark,
      table_id,
      table_no,
      print_count,
      created_at,
      updated_at,
      kot_status,
      description,
      web_id
    FROM
      kot
    WHERE
      customer_id IS NULL
      AND pos_order_id IS NULL
      AND sync = 0  
      LIMIT 20
  `
		)
		.all([]);

	const kotItemStmt = db2.prepare(
		"SELECT id, item_id, item_name, quantity, description, variation_name, variation_id, created_at, updated_at, tax_id, price, tax_id, item_addon_items AS item_addonitems , status, web_id FROM kot_items WHERE kot_id = ? AND sync = 0 "
	);

	formattedKots = [];

	kots.forEach(kot => {
		let kotTosync = {
			id: kot.id,
			web_id: kot.web_id,
			restaurant_id: kot.restaurant_id,
			user_id: kot.customer_id,
			token_no: kot.token_no,
			order_type: kot.order_type,
			customer_name: kot.customer_name,
			phone_number: kot.phone_number,
			address: kot.address,
			order_id: kot.order_id,
			kot_items: [],
			landmark: kot.landmark,
			table_id: kot.table_id ? kot.table_id : null,
			table_no: kot.table_no ? kot.table_no : null,
			description: kot.description,
			kot_status: kot.kot_status,
			print_count: kot.print_count,
			created_at: kot.created_at,
			updated_at: kot.updated_at,
		};

		const kotItems = kotItemStmt.all([kot.id]);

		kotItems.forEach(item => {
			const itemTosync = {
				...item,
				item_addonitems: JSON.parse(item?.item_addonitems),
			};

			kotTosync.kot_items.push(itemTosync);
		});

		formattedKots.push(kotTosync);
	});

	// console.log(JSON.stringify(formattedKots));
	return formattedKots;
};

module.exports = { getKotToSync };

