import React, { memo } from "react";
import styles from "./SideBarReportsList.module.css";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

function SideBarReportsList({ toggleReport, handleClose }) {
	return (
		<AnimatePresence initial={false}>
			{toggleReport && (
				<motion.section
					key="content"
					initial="collapsed"
					animate="open"
					exit="collapsed"
					variants={{
						open: { opacity: 1, scaleY: 1, originY: 0, height: "auto" },
						collapsed: { opacity: 0, scaleY: 0, originY: 0, height: 0 },
					}}
					transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
					className={`${styles.container}`}
					onClick={handleClose}>
					<Link to="reports/salesSummary" className={styles.report}>Sales summary</Link>
					<Link  to="reports/ordersSummary" className={styles.report}>Order summary</Link>
				</motion.section>
			)}
		</AnimatePresence>
	);
}

export default memo(SideBarReportsList);
