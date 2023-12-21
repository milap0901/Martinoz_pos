import React from "react";
import styles from "./AssignPrinterToBill.module.css";

function AssignPrinterToBill({ printerBillOrderType, setPrinterBillOrderType, printer, setPrinter }) {
	const handleStatusChange = (e) => {
		const { name, value, type } = e.target;

		setPrinterBillOrderType((prev) => {
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
					type="checkbox"
					id={"billStatus"}
					checked={printer.assignToBillStatus}
					onChange={() => setPrinter((prev) => ({ ...prev, assignToBillStatus: !prev.assignToBillStatus }))}
				/>
				<label
					className={styles.headerText}
					htmlFor={"billStatus"}>
					{" "}
					Assign Printer to Bill
				</label>
			</header>
			<main className={styles.assignBillMain}>
				<div className={styles.assignConfigTable}>
					<div className={styles.tableHeading}>
						<div className={styles.orderType}>Order Type</div>
						<div className={styles.copyCount}>Print Copies</div>
					</div>
					<div className={styles.Tabledata}>
						{printerBillOrderType.map((orderType) => {
							return (
								<div
									className={styles.tableRow}
									key={orderType.order_type}>
									<div className={styles.statusControl}>
										<input
											className={styles.checkBox}
											id={orderType.order_type + "A"}
											type="checkbox"
											name={orderType.order_type}
											onChange={handleStatusChange}
											checked={orderType.isChecked}
											disabled={!printer.assignToBillStatus}
										/>
										<label
											htmlFor={orderType.order_type + "A"}
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
											disabled={!orderType.isChecked || !printer.assignToBillStatus}
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

export default AssignPrinterToBill;
