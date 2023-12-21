const { contextBridge, ipcRenderer } = require("electron");

const ipcApi = {
	request: (chanel, payload) => {
		return ipcRenderer.invoke(chanel, payload);
	},
	

};

contextBridge.exposeInMainWorld("apiKey", ipcApi);
