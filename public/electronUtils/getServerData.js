const getServerData = (db2) =>{
    try {
		console.log("getServerData ran");
		const startUpData = db2.prepare("SELECT * FROM startup_config").all();
		const resultObject = {};
		for (const item of startUpData) {
			resultObject[item.name] = item.value || null;
		}
		return resultObject;
	} catch (err) {
		console.log("serverData not found :",err);
		return undefined;
	}

}

module.exports = {getServerData}