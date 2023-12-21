import React from "react";
import styles from "./SelectPrinter.module.css";
import { v4 } from "uuid";

function SelectPrinter({ printer, setPrinter, connectedPrinters }) {
	const printerTypes = ["30 mm", "40 mm"];

	
	return (
		<main className={styles.selectPrinterMain}>
			<div className={styles.printerInfoField}>
				<div className={styles.inputLabel}>
					<label>Printer Name</label>
				</div>
				<div className={styles.inputFied}>
					<input
						value={printer.printer_display_name}
						onChange={(e) => setPrinter((state) => ({ ...state, printer_display_name: e.target.value }))}
					/>
				</div>
			</div>
			<div className={styles.printerInfoField}>
				<div className={styles.inputLabel}>
					<label>Select Printer</label>
				</div>
				<div className={styles.inputFied}>
					<select
						className={styles.selectField}
						name="connectedPrinters"
						onChange={(e) => setPrinter((state) => ({ ...state, selectedPrinter: e.target.value }))}
						value={printer.selectedPrinter}>
						{connectedPrinters &&
							connectedPrinters?.map((printer) => {
								return (
									<option
										className={styles.printerSelectOption}
										key={v4()}
										value={printer.name}>
										{printer.name}
									</option>
								);
							})}
					</select>
				</div>
			</div>
			<div className={styles.printerInfoField}>
				<div className={styles.inputLabel}>
					<label>Printer Type</label>
				</div>
				<div className={styles.inputFied}>
					<select
						className={styles.selectField}
						name="printerType"
						onChange={(e) => setPrinter((state) => ({ ...state, printerType: e.target.value }))}
						value={printer.printerType}>
						{printerTypes?.map((printer) => {
							return (
								<option
									className={styles.printerSelectOption}
									key={v4()}
									value={printer}>
									{printer}
								</option>
							);
						})}
					</select>
				</div>
			</div>
		</main>
	);
}

export default SelectPrinter;
