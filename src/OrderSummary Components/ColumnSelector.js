import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import styles from "./ColumnSelector.module.css";

function ColumnSelector({ showSelector, table ,outsideRef }) {
	return (
		<AnimatePresence initial={false}>
			{showSelector && (
				<motion.section
                    ref={outsideRef}
					layout
					key="reportFilters"
					initial="collapsed"
					animate="open"
					exit="collapsed"
					variants={{
						open: { opacity: 1, originY: 0, height:"300px" },
						collapsed: { opacity: 0, originY: 0, height: 0  },
					}}
					transition={{ duration: 0.2 }}
					className={styles.selectorContainer}>
					<div className={styles.columnContainer}>
						<label>
							<input
								{...{
									type: "checkbox",
									checked: table.getIsAllColumnsVisible(),
									onChange: table.getToggleAllColumnsVisibilityHandler(),
								}}
							/>{" "}
							Toggle All
						</label>
					</div>
					{table.getAllLeafColumns().map(column => {
						return (
							<div key={column.id} className={styles.columnContainer}>
								<label>
									<input
										{...{
											type: "checkbox",
											checked: column.getIsVisible(),
											onChange: column.getToggleVisibilityHandler(),
										}}
									/>{" "}
									{column.id}
								</label>
							</div>
						);
					})}
				</motion.section>
			)}
		</AnimatePresence>
	);
}

export default ColumnSelector;
