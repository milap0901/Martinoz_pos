import React from "react";
import styles from "./AssignPrinterToKot.module.css";

function AssignPrinterToKot({ printerKotOrderType, setPrinterKotOrderType, printer, setPrinter }) {
	const handleStatusChange = (e) => {
		const { name, value, type } = e.target;

		setPrinterKotOrderType((prev) => {
			return prev.map((ordertype) => {
				if (ordertype.order_type === name) {
					if (type === "checkbox") {
						return { ...ordertype, isChecked: !ordertype.isChecked };
					} else {
						if (/^[0-9]\d*$/.test(value)) {
							return { ...ordertype, copyCount: value };
						} else {
							return { ...ordertype, copyCount: "" };
						}
					}
				} else {
					return ordertype;
				}
			});
		});
	};
	return (
		<div className={styles.printerAssingnBody}>
			<header>
				<input
					id={"kotStatus"}
					type="checkbox"
					checked={printer.assignToKotStatus}
					onChange={() => setPrinter((prev) => ({ ...prev, assignToKotStatus: !prev.assignToKotStatus }))}
				/>
				<label
					className={styles.headerText}
					htmlFor={"kotStatus"}>
					{" "}
					Assign Printer to KOT{" "}
				</label>
			</header>
			<main className={styles.assignBillMain}>
				<div className={styles.assignConfigTable}>
					<div className={styles.tableHeading}>
						<div className={styles.orderType}>Order Type</div>
						<div className={styles.copyCount}>Print Copies</div>
					</div>
					<div className={styles.Tabledata}>
						{printerKotOrderType.map((orderType) => {
							return (
								<div
									className={styles.tableRow}
									key={orderType.order_type}>
									<div className={styles.statusControl}>
										<input
											className={styles.checkBox}
											id={orderType.order_type + "B"}
											type="checkbox"
											disabled={!printer.assignToKotStatus}
											name={orderType.order_type}
											onChange={handleStatusChange}
											checked={orderType.isChecked}
										/>
										<label
											htmlFor={orderType.order_type + "B"}
											className={styles.orderTypeName}>
											{orderType.order_type}
										</label>
									</div>
									<div className={styles.countControl}>
										<input
											className={styles.copyCountNumber}
											type="number"
											min="0"
											step="1"
											name={orderType.order_type}
											onChange={handleStatusChange}
											value={orderType.copyCount}
											disabled={!orderType.isChecked || !printer.assignToKotStatus}
										/>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</main>
		</div>
	);
}

export default AssignPrinterToKot;
