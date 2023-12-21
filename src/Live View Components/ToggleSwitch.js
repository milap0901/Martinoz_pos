import React, { useState } from "react";
import styles from "./ToggleSwitch.module.css";

function ToggleSwitch() {
	const [active, setActive] = useState(true);

	return (
		<div
			className={styles.container}
			onClick={()=>setActive(prev=> !prev )}>
			<div className={`${styles.switch} ${active ? styles.active : styles.inActive}`}></div>
		</div>
	);
}

export default ToggleSwitch;
