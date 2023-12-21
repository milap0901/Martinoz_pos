import React, { memo, useMemo, useState } from "react";
import styles from "./ReportTable.module.css";

import { getCoreRowModel, getSortedRowModel, useReactTable, flexRender, Filters, getFilteredRowModel } from "@tanstack/react-table";
import getDisplayName from "../Utils/getDisplayName";
import ColumnVisibilitySelector from "./ColumnVisibilitySelector";
import { AnimatePresence, motion } from "framer-motion";

function ReportTable({ orders }) {
	const [sorting, setSorting] = useState([]);
	const [globalFilter, setGlobalFilter] = useState("");

	// const getTotalHeaders = useCallback(orders => {
	// 	return orders.reduce(
	// 		(acc, order) => {
	// 			acc.myAmountTotal += +order.item_total;
	// 			acc.discountTotal += +order.total_discount;
	// 			acc.deliveryTotal += +order.delivery_charges;
	// 			acc.totalTotal += +order.settle_amount || 0;
	// 			acc.taxTotal += +order.total_tax;
	// 			acc.tipTotal += +order.tip || 0;
	// 			return acc;
	// 		},
	// 		{ myAmountTotal: 0, discountTotal: 0, deliveryTotal: 0, taxTotal: 0, totalTotal: 0, tipTotal: 0 }
	// 	);
	// }, []);

	// const headerTotals = useMemo(() => getTotalHeaders(orders), [orders]);

	const getColumnTotal = (table, columnId) => {
		return +table.getRowModel().rows.reduce((acc, row) => (acc += +row.getValue(columnId)), 0);
	};

	const columns = useMemo(
		() => [
			{
				header: "Order No.",
				id: "Order No",
				accessorKey: "bill_no",
				footer: " ",
			},
			{
				header: "Date",
				id: "Date",
				accessorFn: row => row.created_at,
				cell: info => info.getValue().split(" ")[0],
				footer: " ",
			},
			{
				header: "Payment Type",
				id: "Payment Type",
				accessorFn: row => getDisplayName(row.payment_type),
				// accessorKey: "payment_type",
				footer: " ",
			},
			{
				header: "Order Type",
				id: "Order Type",
				accessorFn: row => getDisplayName(row.order_type),
				// accessorKey: "order_type",
				footer: " ",
			},
			{
				header: "Area Type",
				id: "Area",
				accessorFn: row => row.order_area || "-",
				footer: " ",
			},
			{
				header: "My Amount (₹)",
				id: "My Amount",
				accessorFn: row => row.item_total.toFixed(2),
				cell: info => <div style={{textAlign:"right"}}>{info.getValue()}</div>,
				footer: ({ table }) => getColumnTotal(table, "My Amount").toFixed(2),
			},
			{
				header: "Discount (₹)",
				id: "Discount",
				accessorFn: row => row.total_discount.toFixed(2),
				cell: info => <div style={{textAlign:"right"}}>{info.getValue()}</div>,
				footer: ({ table }) => getColumnTotal(table, "Discount").toFixed(2),
			},
			{
				header: "Delivery Charge (₹)",
				id: "Delivery",
				accessorFn: row => row.delivery_charges.toFixed(2),
				cell: info => <div style={{textAlign:"right"}}>{info.getValue()}</div>,
				footer: ({ table }) => getColumnTotal(table, "Delivery").toFixed(2),
			},
			{
				header: "Tax (₹)",
				id: "Tax",
				accessorFn: row => row.total_tax.toFixed(2),
				cell: info => <div style={{textAlign:"right"}}>{info.getValue()}</div>,
				footer: ({ table }) => getColumnTotal(table, "Tax").toFixed(2),
			},
			{
				header: "Waived Off (₹)",
				id: "Waived Off",
				accessorFn: row => (+row.settle_amount - +row.item_total - +row.total_tax + +row.total_discount).toFixed(2),
				cell: info => <div style={{textAlign:"right"}}>{info.getValue()}</div>,
				footer: ({ table }) => (getColumnTotal(table, "Total") - getColumnTotal(table, "Tax") - getColumnTotal(table, "My Amount") + getColumnTotal(table,"Discount")).toFixed(2),
			},
			{
				header: "Total (₹)",
				id: "Total",
				accessorFn: row => row.settle_amount?.toFixed(2) || 0,
				cell: info => <div style={{textAlign:"right"}}>{info.getValue()}</div>,
				footer: ({ table }) => getColumnTotal(table, "Total").toFixed(2),
			},
			{
				header: "Tip (₹)",
				id: "Tip",
				accessorFn: row => row.tip?.toFixed(2) || 0,
				cell: info => <div style={{textAlign:"right"}}>{info.getValue()}</div>,
				footer: ({ table }) => getColumnTotal(table, "Tip").toFixed(2),
			},
			{
				header: "Tip + Total (₹)",
				id: "Tip + Total",
				accessorFn: row => ((+row?.tip || 0) + (+row?.settle_amount || 0)).toFixed(2),
				cell: info => <div style={{textAlign:"right"}}>{info.getValue()}</div>,
				footer: ({ table }) => (getColumnTotal(table, "Tip") + getColumnTotal(table, "Total")).toFixed(2),
			},
		],
		[orders]
	);

	const table = useReactTable({
		data: orders,
		columns,
		state: {
			sorting,
			globalFilter,
		},
		onSortingChange: setSorting,
		onGlobalFilterChange: setGlobalFilter,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
	});

	if (!orders.length) {
		return <div className={styles.noOrders}>there is no records to show.</div>;
	}
	return (
		<>
			<ColumnVisibilitySelector table={table} setGlobalFilter={setGlobalFilter} />
			<div className={styles.tableContainer}>
				
					<motion.table
						className={styles.mainTable}
						layout
						key="reportFilters"
						initial="collapsed"
						animate="open"
						exit="collapsed"
						variants={{
							open: { height: "auto",opacity:1 },
							collapsed: {  height: 0, opacity:0 },
						}}
						transition={{ duration: 0.1 }}>
						<thead className={styles.tableHeader}>
							{table.getHeaderGroups().map(headerGroup => (
								<tr key={headerGroup.id} className={styles.headerRow}>
									{headerGroup.headers.map(header => {
										return (
											<th key={header.id} colSpan={header.colSpan}>
												{header.isPlaceholder ? null : (
													<div onClick={header.column.getToggleSortingHandler()} className={styles.headerCell}>
														<div>{flexRender(header.column.columnDef.header, header.getContext())}</div>
														<div className={styles.sortArrow}>
															{header.column.getIsSorted() === "asc" && "↑"}
															{header.column.getIsSorted() === "desc" && "↓"}
															{!header.column.getIsSorted() && " "}
														</div>
													</div>
												)}
											</th>
										);
									})}
								</tr>
							))}
						</thead>

						<tbody className={styles.tableBody}>
							{table.getRowModel().rows.map(row => {
								return (
									<tr key={row.id}>
										{row.getVisibleCells().map(cell => {
											return <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>;
										})}
									</tr>
								);
							})}
						</tbody>

						<tfoot className={styles.tableFooter}>
							{table.getFooterGroups().map(footerGroup => (
								<tr key={footerGroup.id}>
									{footerGroup.headers.map(header => (
										<th key={header.id} colSpan={header.colSpan} className={styles.footerCell}>
											{header.isPlaceholder ? null : flexRender(header.column.columnDef.footer, header.getContext())}
										</th>
									))}
								</tr>
							))}
						</tfoot>
					</motion.table>
				
			</div>
		</>
	);
}

export default memo(ReportTable);
