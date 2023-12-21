import React, { useState } from "react";
import styles from "./ServerConfig.module.css";
import { useSelector, useDispatch } from "react-redux";
import { setSystem } from "../Redux/serverConfigSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useMutation } from "react-query";
import { modifyCartData } from "../Redux/finalOrderSlice";
import Loading from "../Feature Components/Loading";

function ServerConfig() {
	const { systemType, IPAddress } = useSelector(state => state.serverConfig);
	const [clientLoading, setClientLoading] = useState(false);
	const [errorMsg, setErrorMsg] = useState("");

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const getServerStatus = async () => {
		const { data } = await axios.get(`http://${IPAddress}:3001/defaultScreenData`, { timeout: 5000 });
		// console.log(data)
		return data;
	};

	const handleChange = e => {
		let { name, value } = e.target;
		dispatch(setSystem({ name, value }));
	};

	const {
		mutate: serverMutation,
		isLoading,
		isError,
	} = useMutation({
		mutationKey: "serverStatus",
		mutationFn: getServerStatus,
		cacheTime: 0,
		onSuccess: async data => {
			const res = await window.apiKey.request("storeServerData", { IPAddress, systemType });

			// IPAddress && localStorage.setItem("IP", IPAddress);
			// systemType && localStorage.setItem("systemType", systemType);
			dispatch(modifyCartData({ orderType: data.default_order_type || "delivery" }));
			dispatch(modifyCartData({ paymentMethod: data.default_payment_type || "cash" }));

			navigate("../login");

			// data.default_view === "table_view" ? navigate("/Home/tableView") : navigate("/Home");
		},
		onError: () => {
			setClientLoading(false);
			setErrorMsg("server is not responding");
		},
		onSettled: () => {
			setClientLoading(false);
		},
	});

	const handleClick = async system => {
		setClientLoading(true);
		if (system === "server") {
			try {
				let res = await window.apiKey.request("setup", system);
			} catch (err) {
				setErrorMsg("Server did not start");
			}
		}
		serverMutation();
	};

	// useEffect(() => {
	// 	if (localStorage.getItem("systemType")) {
	// 		handleClick(localStorage.getItem("systemType"));
	// 	}
	// }, []);

	if (isLoading || clientLoading) {
		return (
			<div className={styles.serverConfig}>
				<Loading />
			</div>
		);
	} else {
		return (
			<div className={styles.serverConfig}>
				<div className={styles.main}>
					<div>
						<input className={styles.radio} id="server" type="radio" name="systemType" value="server" checked={systemType === "server"} onChange={handleChange} />{" "}
						<label htmlFor="server">setup as server </label>
					</div>

					<div>
						<input className={styles.radio} id="client" type="radio" name="systemType" value="client" checked={systemType === "client"} onChange={handleChange} />{" "}
						<label htmlFor="client"> setup as client </label>
					</div>
					<div>
						<label>Server IP Address :</label>
						<input type="text" className={styles.ipAddress} name="IPAddress" value={IPAddress} placeholder="192.168.1.208" onChange={handleChange} />
					</div>
					{isError && <div className={styles.err}> {errorMsg} </div>}
					<button className={styles.btn} onClick={() => handleClick(systemType)} disabled={systemType.length === 0 || IPAddress.trim().length === 0}>
						{isLoading ? "loading..." : "next"}
					</button>
				</div>
			</div>
		);
	}
}

export default ServerConfig;
