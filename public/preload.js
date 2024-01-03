
const { contextBridge, ipcRenderer } = require("electron");

const ipcApi = {
	request: (chanel, payload) => {
		return ipcRenderer.invoke(chanel, payload);
	},

	handle: (channel, cb) => {
		return ipcRenderer.handle(channel, cb);
	},

	renderedOn: (channel,callback) => ipcRenderer.on(channel, (_event, value) => callback(value)),

	rendereOff: (channel) => ipcRenderer.removeAllListeners(channel) 
};

contextBridge.exposeInMainWorld("apiKey", ipcApi);
