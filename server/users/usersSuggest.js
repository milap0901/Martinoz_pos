const { dbAll, dbRun } = require("../common/dbExecute");
// const Database = require("better-sqlite3");
// const db2 = new Database("restaurant.sqlite", {});

const { getDb } = require("../common/getDb");
const db2 = getDb();

const getUserSuggest = data => {
	let matches;

	if (data.customerContact) {
		matches = db2
			.prepare(
				`SELECT id, name, number FROM customers WHERE number LIKE $number || '%' ORDER BY CASE WHEN number = $number THEN 0 WHEN number LIKE $number || '%' THEN 1 ELSE 2 END LIMIT 15`
			)
			.all({
				number: data.customerContact,
			});
	} else {
		matches = db2.prepare(`SELECT id, name, number FROM customers WHERE name LIKE $name || '%' ORDER BY CASE WHEN name = $name THEN 0 WHEN name LIKE $name || '%' THEN 1 ELSE 2 END LIMIT 15`).all({
			name: data.customerName,
		});
		// matches = await dbAll(db, `SELECT id,name,number FROM users WHERE name LIKE "${data.customerName}%" LIMIT 10`, []);
	}

	for (const match of matches) {
		match.addresses = db2.prepare("SELECT complete_address,landmark FROM customer_addresses WHERE customer_id=?").all(match.id);
	}
	return matches;
};

module.exports = { getUserSuggest };
