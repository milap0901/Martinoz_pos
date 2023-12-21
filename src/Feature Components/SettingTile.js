import React from "react";
import styles from "./SettingTile.module.css";
import { Link } from "react-router-dom";


function SettingTile({title,to}) {
	return (
		<Link
			className={styles.printerConfigOptions}
			to={to}>
			<div>{title}</div>
		</Link>
    
	);
}

export default SettingTile;
