import React from "react";
import styles from "./PrinterConfig.module.css";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";
import BackButton from "../Feature Components/BackButton";
import SettingTile from "../Feature Components/SettingTile.js";

function PrinterConfig() {
	const printerConfigItems = [
		{ title: "Multiple Printer Setting", navigateTo: "PrintersList" },
		{ title: "Bill/KOT Preferred Configuration", navigateTo: "" },
	];
	const navigate = useNavigate();
	return (
		<motion.div
			className={styles.printerConfigBody}
			initial={{ opacity: 0, scale: 0.98 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.1 }}>
			<header>
				<div className={styles.headerText}> Bill / KOT Printer Configuration </div>
				<BackButton onClick={() => navigate("..")} />
			</header>
			<main className={styles.printerConfigMain}>
				{printerConfigItems.map((item) => {
					return (
						<SettingTile
							key={v4()}
							to={item.navigateTo}
							title={item.title}
						/>
					);
				})}
			</main>
		</motion.div>
	);
}

export default PrinterConfig;
