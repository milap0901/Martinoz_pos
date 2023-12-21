const { getDb } = require("../common/getDb");
const db2 = getDb();
const bcrypt = require("bcrypt");

const authenticateBiller = async billerCred => {
	const { name, password } = billerCred;
	const user = db2.prepare("SELECT password FROM billers WHERE name= ?").get([name]);
	let isValid = false;

	if (user) {
		console.log(user)
		const hashPass = /^\$2y\$/.test(user.password) ? "$2a$" + user.password.slice(4) : user.password;
		isValid = await bcrypt.compare(password, hashPass);
	}
	console.log(isValid)
	return isValid;
};

module.exports = { authenticateBiller };
