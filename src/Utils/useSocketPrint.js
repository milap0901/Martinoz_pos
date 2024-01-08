import { io } from "socket.io-client";
import { useEffect } from "react";
import { useSelector } from "react-redux";

let socket = null;
const useSocketPrint = (event,ipAddress,printers,defaultSettings,systemType,callBack) => {
	

	useEffect(() => {
		try {
			if (!socket && ipAddress&& systemType === "server") {
				socket = io(`http://${ipAddress}:3001`);
			}

			socket?.on(event, callBack);
		} catch (error) {
			console.log(error)
		}

		return () => {
			socket?.off(event, callBack);
		};
	}, [ipAddress,printers,defaultSettings]);
};

export default useSocketPrint;
