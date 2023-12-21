// const Database = require("better-sqlite3");
// const db2 = new Database("restaurant.sqlite", {});

const { getDb } = require("../common/getDb")
const db2 = getDb()


const updateDefaultScreenData = (req, res) => {
	const options = JSON.stringify(req.body);
	console.log(options);

	try {
		const screenDataStmt = db2.prepare("UPDATE restaurants SET configuration = ? where id=? ").run(options, 1);
		res.sendStatus(200);
	} catch(err) {
		res.status(400).json("something went wrong");
        console.log(err)
	}
};

module.exports = { updateDefaultScreenData };
