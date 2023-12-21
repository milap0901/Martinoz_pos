import React, { memo, useState } from "react";
import styles from "./ReportFilters.module.css";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FilterFields from "./FilterFields";
import { getToday, getTomrrow, getYesterDay } from "../Utils/getDate";
const todaysDate = getToday();
const yesterdaysDate = getYesterDay();
const tomorrowsDate = getTomrrow();

function ReportFilters({ filters, setFilters, fetchOrders ,filtersMap}) {
	const [showFilter, setShowFilter] = useState(false);

	const getOrderByDate = (from, to) => {
		setFilters(prev => ({ ...prev, from: from, to: to, payment_type: "all", order_type: "all" }));

		setTimeout(() => {
			fetchOrders();
		}, 0);
	};

	return (
		<div className={styles.reportFilters}>
			<div className={styles.filterControls}>
				<button className={styles.searchbtn} onClick={() => setShowFilter(!showFilter)}>
					<FontAwesomeIcon icon={faMagnifyingGlass} /> Search
				</button>
				<button className={styles.yesteDaySalesbtn} onClick={() => getOrderByDate(yesterdaysDate, todaysDate)}>
					Yesterday Sales
				</button>
				<button className={styles.todaySalesbtn} onClick={() => getOrderByDate(todaysDate, tomorrowsDate)}>
					Today Sales
				</button>
			</div>
			<FilterFields setShowFilter={setShowFilter} showFilter={showFilter} filters={filters} setFilters={setFilters} fetchOrders={fetchOrders} filtersMap={filtersMap} />
			
		</div>
	);
}

export default memo(ReportFilters);
