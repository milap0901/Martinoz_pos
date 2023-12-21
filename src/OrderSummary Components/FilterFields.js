import React, { useMemo } from "react";
import styles from "./FilterFields.module.css";
import { AnimatePresence, motion } from "framer-motion";

function FilterFields({ setShowFilter, showFilter, filters, setFilters, fetchOrders, filtersMap }) {
	return (
		<AnimatePresence initial={false}>
			{showFilter && (
				<motion.section
					layout
					key="reportFilters"
					initial="collapsed"
					animate="open"
					exit="collapsed"
					variants={{
						open: { opacity: 1, originY: 0, height: "auto" },
						collapsed: { opacity: 0, originY: 0, height: 0 },
					}}
					transition={{ duration: 0.2 }}
					className={styles.filterWraper}>
					<div className={styles.filterFieldContainer}>
						{" "}
						{filtersMap.map(filter => {
							return (
								<div key={filter.name} className={styles.filterTiles}>
									<label>{filter.displayName}</label>
									{filter.type === "date" ? (
										<input
											type="datetime-local"
											step="1"
											value={filters[filter.name]}
											onChange={e => setFilters(prev => ({ ...prev, [filter.name]: e.target.value }))}
										/>
									) : (
										<select
											className={styles.selectOptions}
											value={filters[filter.name]}
											onChange={e => setFilters(prev => ({ ...prev, [filter.name]: e.target.value }))}>
											{filter.options.map(option => {
												return (
													<option value={option.value} key={option.value}>
														{" "}
														{option.name}
													</option>
												);
											})}
										</select>
									)}
								</div>
							);
						})}
					</div>
					<div className={styles.searchControl}>
						<button
							className={styles.searchBtn}
							onClick={async() => {
								await fetchOrders();
								setShowFilter(false);
							}}>
							Search
						</button>
					</div>
				</motion.section>
			)}
		</AnimatePresence>
	);
}

export default FilterFields;
