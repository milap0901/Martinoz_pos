import React from "react";
import styles from "./SalesOrdersStatusTable.module.css";

function SalesOrdersStatusTable({ salesTotalSummary }) {
	return (
		<div className={styles.tableWraper}>
			<header>Order Status</header>
			<table>
				<thead>
					<tr>
						<th>Order Status</th>
						<th>My Amount</th>
						<th>Total</th>
						<th>Order Count</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>Saved</td>
						<td>
							{salesTotalSummary?.totalMyAmount?.saved.toLocaleString("en-US", {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							})}
						</td>
						<td>
							{salesTotalSummary?.totalSettleAmount?.saved.toLocaleString("en-US", {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							})}
						</td>
						<td>{salesTotalSummary?.orderCount.saved}</td>
					</tr>
					<tr>
						<td>Printed</td>
						<td>
							{salesTotalSummary?.totalMyAmount?.printed.toLocaleString("en-US", {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							})}
						</td>
						<td>
							{salesTotalSummary?.totalSettleAmount?.printed.toLocaleString("en-US", {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							})}
						</td>
						<td>{salesTotalSummary?.orderCount?.printed}</td>
					</tr>
					<tr>
						<td>Cancelled</td>
						<td>
							{salesTotalSummary?.totalMyAmount?.cancelled.toLocaleString("en-US", {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							})}{" "}
						</td>
						<td>
							{salesTotalSummary?.totalSettleAmount?.cancelled.toLocaleString("en-US", {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							})}
						</td>
						<td>{salesTotalSummary?.orderCount?.cancelled}</td>
					</tr>
					<tr>
						<td>Complementory</td>
						<td>0.00</td>
						<td>0.00</td>
						<td>0</td>
					</tr>
				</tbody>
				<tfoot>
					<tr>
						<th>Total :</th>
						<th>
							{salesTotalSummary?.totalMyAmount?.total.toLocaleString("en-US", {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							})}
						</th>
						<th>
							{salesTotalSummary?.totalSettleAmount?.total.toLocaleString("en-US", {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							})}
						</th>
						<th>{salesTotalSummary?.orderCount?.total}</th>
					</tr>
				</tfoot>
			</table>
		</div>
	);
}

export default SalesOrdersStatusTable;
