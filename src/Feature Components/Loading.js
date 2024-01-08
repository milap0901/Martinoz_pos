import React from "react";
import styles from "./Loading.module.css"

// loading screen component
function Loading() {
	return (
		<div className={styles.container}>
		<div className={styles.ellipsis}>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
		</div>
		</div>
	);
}

export default Loading;


