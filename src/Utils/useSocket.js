import { io } from "socket.io-client";
import { useEffect } from "react";
import { useSelector } from "react-redux";

let socket = null;
const useSocket = (event, callBack) => {
	const ipAddress = useSelector(state => state.serverConfig.IPAddress);

	useEffect(() => {
		try {
			if (!socket && ipAddress) {
				socket = io(`http://${ipAddress}:3001`);
			}

			socket?.on(event, callBack);
		} catch (error) {
			console.log(error)
		}

		return () => {
			socket?.off(event, callBack);
		};
	}, [ipAddress]);
};

export default useSocket;
