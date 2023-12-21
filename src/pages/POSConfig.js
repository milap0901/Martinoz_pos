import React, { useState } from "react";
import styles from "./POSConfig.module.css";
import configImage from "../icons/ic_DataSync.png";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import Loading from "../Feature Components/Loading";

function POSConfig() {
	const navigate = useNavigate();
	const [syncCode, setSyncCode] = useState("");

	const syncDatabase = async syncCred => {
		const data = await window.apiKey.request("syncDatabase", syncCred);
		return data;
	};

	const { data, mutate, isLoading, isError, error } = useMutation({
		mutationKey: "syncDatabase",
		mutationFn: syncDatabase,
		onSuccess: data => {
			console.log(data);
			navigate("/serverConfig");
		},
		onError: data => {
			console.log(data);
		},
	});

	const handleSync = async syncCode => {
		mutate({ syncCode, token: process.env.REACT_APP_API_TOKEN || "cAvQwn2tjnS8ynb9" });
	};
	return (
		<main className={styles.congfigBody}>
			{isLoading ? (
				<div className={styles.loadingContainer}>
					<Loading />
				</div>
			) : null}
			<header className={styles.configHeader}>
				<div className={styles.configHeaderText}> Martino'z</div>
			</header>
			<section className={styles.configContainer}>
				<div className={styles.configImage}>
					<img src={configImage} alt="configImage" />
				</div>
				<div className={styles.configControlsContainer}>
					<header> Data Sync</header>
					<section>
						<div>Lets start. sync your data. </div>
						<div className={styles.syncCodeControl}>
							<input type="text" placeholder="please enter sync code" value={syncCode} onChange={e => setSyncCode(e.target.value)}></input>
							<button onClick={() => handleSync(syncCode)} disabled={isLoading}>
								{" "}
								sync
							</button>
						</div>
					</section>
					{isError ? <div className={styles.errorText}>something went wrong</div> : null}
				</div>
			</section>
		</main>
	);
}

export default POSConfig;
