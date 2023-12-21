import React, { useState, useEffect } from "react";
import styles from "./Timer.module.css";

function Timer({ startTime }) {
	const [timer, setTimer] = useState();

	const initialDate = new Date(startTime);
	const initalTime = initialDate.getTime();

	function getTimeDifference(initialTime) {
		const now = new Date();
		const difference = now - initialTime;
		const hours = Math.floor(difference / (1000 * 60 * 60));
		const min = Math.floor((difference % (1000 * 60 * 60)) / 60000);
		const minutes = Math.floor(difference / 60000);
		const seconds = ((difference % 60000) / 1000).toFixed(0);
		const timer = `${hours < 1 ? "" : `${hours} :`} ${min < 10 ? "0" : ""}${min} : ${seconds < 10 ? "0" : ""}${seconds}`;
		setTimer(timer);
	}

	useEffect(() => {
		getTimeDifference(initalTime);

		const int = setInterval(() => {
			getTimeDifference(initalTime);
		}, 1000);

		return () => {
			clearInterval(int);
		};
	}, []);

	return <div className={styles.timer}>{timer}</div>;
}

export default React.memo(Timer);
