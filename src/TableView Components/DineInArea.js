import React from "react";
import styles from "./DineInArea.module.css";
import ActiveTableCard from "./ActiveTableCard";
import InactiveTableCard from "./InactiveTableCard";
import ActiveKotTableCard from "./ActiveKotTableCard";

function DineInArea({ area, restaurantPriceId,printers,defaultSettings }) {
	return (
		<div className={styles.areaSection}>
			<div className={styles.areaTitle}>{area.area}</div>
			<div className={styles.tableList}>
				{area.tables.map(table => {
					if (table.orders.length && table.type === "order") {
						return table.orders.map(order => {
							return <ActiveTableCard key={order.id} order={order} printers={printers} defaultSettings={defaultSettings} />;
						});
					}
					
					if (table.orders.length && table.type === "kot") {
						return <ActiveKotTableCard key={table.orders[0].id} orders={table.orders} areaId={area.id} printers={printers} defaultSettings={defaultSettings} />;
					} else {
						return <InactiveTableCard area={area.area} key={table.id} table={table} restaurantPriceId={restaurantPriceId} />;
					}
				})}
			</div>
		</div>
	);
}

export default DineInArea;
