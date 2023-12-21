import React, { useCallback, useMemo, useState } from "react";
import styles from "./OrdersSummary.module.css";
import ReportFilters from "../OrderSummary Components/ReportFilters";
import { getToday, getTomrrow } from "../Utils/getDate";
import ReportTable from "../OrderSummary Components/ReportTable";
import { useGetOrderSummaryQuery } from "../Utils/customQueryHooks";
import Loading from "../Feature Components/Loading";
import ReportPeriod from "../OrderSummary Components/ReportPeriod";

const today = getToday();
const tomrrow = getTomrrow();

const filtersMap = [
	{ name: "from", displayName: "From", type: "date" },
	{ name: "to", displayName: "To", type: "date" },
	{
		name: "payment_type",
		displayName: "Payment Type",
		type: "select",
		options: [
			{ name: "All", value: "all" },
			{ name: "Card", value: "card" },
			{ name: "Due", value: "due" },
			{ name: "UPI", value: "upi" },
			{ name: "Cash", value: "cash" },
		],
	},
	{
		name: "order_type",
		displayName: "Order Type",
		type: "select",
		options: [
			{ name: "All", value: "all" },
			{ name: "Dine In", value: "dine_in" },
			{ name: "Delivery", value: "delivery" },
			{ name: "Pick Up", value: "pick_up" },
		],
	},
];

function OrdersSummary() {
	const [filters, setFilters] = useState({ from: today, to: tomrrow, payment_type: "all", order_type: "all" });

	const { data: orders, isLoading, refetch } = useGetOrderSummaryQuery(filters);

	const fetchOrders = useCallback(() => {
		refetch();
	}, []);

	if (isLoading) {
		return (
			<div className={styles.orderSummaryPage}>
				{" "}
				<Loading />
			</div>
		);
	}

	return (
		<div className={styles.orderSummaryPage}>
			<header className={styles.pageHeader}> Orders Report </header>

			<ReportFilters filters={filters} setFilters={setFilters} fetchOrders={fetchOrders} filtersMap={filtersMap} />
			<ReportPeriod duration={orders?.duration} />	
			<ReportTable orders={orders?.orderData || []} />
		</div>
	);
}

export default OrdersSummary;
