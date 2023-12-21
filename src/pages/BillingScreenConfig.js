import React from "react";
import styles from "./BillingScreenConfig.module.css";
import { motion } from "framer-motion";
import BackButton from "../Feature Components/BackButton";
import { useNavigate } from "react-router-dom";
import SettingTile from "../Feature Components/SettingTile";
import { v4 } from "uuid";

function BillingScreenConfig() {
	const navigate = useNavigate();

	const billingScreenConfigItems = [
		{ title: "Billing Screen Configuration", navigateTo: "editBillingScreen" },
		{ title: "Distance Management", navigateTo: "" },
	];

	return (
		<motion.div
			className={styles.ConfigurationBody}
			initial={{ opacity: 0, scale: 0.98 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.1 }}>
			<header className={styles.configHeader}>
				<div className={styles.configInfo}>
					<div>Billing Screen Config</div>
				</div>
				<BackButton onClick={() => navigate("..")} />
			</header>
			<main className={styles.billingScreenConfigMain}>
				{billingScreenConfigItems.map((item) => {
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

export default BillingScreenConfig;
