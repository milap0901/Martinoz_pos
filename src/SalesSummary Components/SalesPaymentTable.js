import React from "react";
import styles from './SalesPaymentTable.module.css'

function SalesPaymentTable({salesTotalSummary}) {
	return (
		<div className={styles.tableWraper}>
			<header>Payment summary</header>
			<table>
				<thead>
					<tr>
						<th>Payment Type</th>
						<th>Total</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>Cash</td>
						<td>
							{salesTotalSummary?.totalCash.toLocaleString("en-US", {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							})}
						</td>						
					</tr>
					<tr>
						<td>Card</td>
						<td>
							{salesTotalSummary?.totalCard.toLocaleString("en-US", {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							})}
						</td>
					</tr>
					<tr>
						<td>Due</td>
						<td>{salesTotalSummary?.totalDue?.toLocaleString("en-US", {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							})}</td>
						
					</tr>
					<tr>
						<td>UPI</td>
						<td>{salesTotalSummary?.totalUpi?.toLocaleString("en-US", {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							})}</td>
						
					</tr>
				</tbody>
				<tfoot>
					<tr>
						<th>Total :</th>
						<th>
							{salesTotalSummary?.totalSettleAmount.total.toLocaleString("en-US", {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							})}
						</th>
					
					</tr>
				</tfoot>
			</table>
		</div>
	);
}

export default SalesPaymentTable;
