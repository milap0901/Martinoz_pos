import React from "react";
import styles from "./ReportPeriod.module.css";

function ReportPeriod({ duration }) {
	return (
		<div className={styles.periodContainer}>
			<div>From : {duration?.from} </div> <div>To: {duration?.to}</div>
		</div>
	);
}

export default ReportPeriod;
