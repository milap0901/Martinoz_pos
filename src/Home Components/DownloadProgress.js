import React, { useEffect, useState } from "react";
import ProgressBar from "react-bootstrap/ProgressBar";
import styles from "./DownloadProgress.module.css";

function DownloadProgress() {
	const [showData, setShowData] = useState(false);
	const [progressBar, setProgressbar] = useState({ show: false, progress: 0 });
	const [checking, setChecking] = useState(false);
	const [noUpdate, setNoUpdate] = useState(false);

	useEffect(() => {
		let timeout;

		window.apiKey.renderedOn("checking", payload => {
			console.log("checking");
			setShowData(true);
			setChecking(true);
		});

		window.apiKey.renderedOn("updateAwailaible", payload => {
			setShowData(true);
			setChecking(false);
			setNoUpdate(false);
			setProgressbar(prev => ({ ...prev, show: true }));
		});

		window.apiKey.renderedOn("updateProgress", payload => {
			setShowData(true);
			setChecking(false);
			setNoUpdate(false);
			setProgressbar(prev => ({ ...prev, progress: payload?.percent }));
		});

		window.apiKey.renderedOn("updateNotAwailaible", payload => {
			setShowData(true);
			setChecking(false);
			setProgressbar({ show: false, progress: 0 });
			setNoUpdate(true);

			timeout = setTimeout(() => {
				setShowData(false);
			}, 20000);
		});

		return () => {
			window.apiKey.rendereOff("updateProgress");
			window.apiKey.rendereOff("Checking");
			window.apiKey.rendereOff("updateAwailaible");
			window.apiKey.rendereOff("updateNotAwailaible");
			if (timeout) {
				clearTimeout(timeout);
			}
		};
	}, []);

	if (!showData) return null;

	if (checking) return <div className={styles.progressTitle}> checking for update.....</div>;

	if (noUpdate) return <div className={styles.progressTitle}> Your Application is already running latest version </div>;

	if (progressBar.show) {
		return (
			<div>
				<div className={styles.progressTitle}>
					{" "}
					<div> Update In Progress...</div>
					<div> {progressBar.progress} %</div>
				</div>
				<ProgressBar className={styles.progressBar} animated now={progressBar.progress} variant="danger" />
			</div>
		);
	}
}

export default DownloadProgress;
