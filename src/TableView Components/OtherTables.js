import React from "react";
import styles from "./OtherTables.module.css";
import ActiveTableCard from "./ActiveTableCard";

function OtherTables({ unListedTables }) {
	return (
		<div className={styles.areaSection}>
			<div className={styles.areaTitle}>Other Tables</div>
			<div className={styles.tableList}>
				{unListedTables.map((table) => {
					return (
						<ActiveTableCard
							key={table.id}
							order={table}
						/>
					);
				})}
			</div>
		</div>
	);
}

export default OtherTables;
