const { fork } = require("child_process");

const getLandingPage = startupConfig => {
	const { ip = null, system_type = null, sync_code = null, last_login_user = null } = startupConfig;

	let landingPage = "Home";

	if (!sync_code) {
		landingPage = "POSConfig";
		return landingPage;
	}

	if (!system_type || !ip) {
		landingPage = "serverConfig";
		return landingPage;
	}

	if (!last_login_user) {
		landingPage = "login";		
		return landingPage;
	}
	return landingPage;
};

const initiateServer = (startupConfig, serverFilePath, destinationFile) => {
	try {
		const { ip=null, system_type=null, sync_code, last_login_user } = startupConfig;
		if (ip && system_type === "server") {
			serverProcess = fork(serverFilePath, [destinationFile]);
			return serverProcess;
		}
	} catch (error) {
		return undefined;
	}
};

module.exports = { getLandingPage, initiateServer };
