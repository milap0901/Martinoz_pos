// const Database = require("better-sqlite3");
// const db2 = new Database("restaurant.sqlite", {});
const { getDb } = require("../common/getDb");
const db2 = getDb();

const getDefaultScreenData = () => {
	try {
		const options = db2
			.prepare("SELECT configuration,name AS branch, address, contact ,gstin, fssai_lic_number  FROM restaurants where id=?")
			.get(1);

		const brandDetails = db2.prepare("SELECT name FROM brands where id=?").get(1);

		return {
			...JSON.parse(options.configuration),
			branch: options.branch,
			name: brandDetails.name,
			address: options.address,
			contact: options.contact,
			fssai: options.fssai_lic_number,
			gstin:options.gstin
		};
	} catch (err) {
		console.log(err);
		return "err";
	}
};

module.exports = { getDefaultScreenData };
