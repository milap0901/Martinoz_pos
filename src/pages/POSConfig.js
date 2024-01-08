import React, { useState } from "react";
import styles from "./POSConfig.module.css";
import configImage from "../icons/ic_DataSync.png";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import Loading from "../Feature Components/Loading";

function POSConfig() {
	const navigate = useNavigate();
	const [syncCode, setSyncCode] = useState("");

	// ipc call to electron ( window.apiKey.request) for setup initial database ( electron will make api call to cloud server and get initial data to setup app)
	// syncCred (object) with {syncCode, token , JWT_SECRET }

	const syncDatabase = async syncCred => {
		const data = await window.apiKey.request("syncDatabase", syncCred);
		return data;
	};

	// react-query mutation call
	const { mutate, isLoading, isError } = useMutation({
		mutationKey: "syncDatabase",
		mutationFn: syncDatabase,
		onSuccess: data => {

			// after success navigate to serverConfig to setup server/client 
			console.log(data);
			navigate("/serverConfig");
		},
		onError: data => {
			console.log(data);
		},
	});

	// onclick handler
	const handleSync = async syncCode => {

		
		mutate({
			syncCode,
			token: process.env.REACT_APP_API_TOKEN || "cAvQwn2tjnS8ynb9",
			JWT_SECRET: "29b927a793a5b4b9dbab2029984c8222ece99a3b1a5300ae988dc726071867c0",
		});
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
						<form className={styles.syncCodeControl}>
							<input
								type="text"
								placeholder="please enter sync code"
								value={syncCode}
								onChange={e => setSyncCode(e.target.value)}></input>
							<button onClick={() => handleSync(syncCode)} disabled={isLoading}>
								sync
							</button>
						</form>
					</section>
					{isError ? <div className={styles.errorText}>something went wrong</div> : null}
				</div>
			</section>
		</main>
	);
}

export default POSConfig;
