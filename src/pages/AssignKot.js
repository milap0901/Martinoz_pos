import React, { useState } from "react";
import styles from "./AssignKot.module.css";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../Feature Components/BackButton";
import { motion } from "framer-motion";
import axiosInstance from "../Feature Components/axiosGlobal";
import { useMutation, useQuery, useQueryClient } from "react-query";
import notify from "../Feature Components/notify";

function AssignKot() {
	const queryClient = useQueryClient();
	const { printerId } = useParams();
	const navigate = useNavigate();
	const [printerKotOrderType, setPrinterKotOrderType] = useState([
		{ order_type: "Delivery", isChecked: false, copyCount: "", id: 1 },
		{ order_type: "Dine In", isChecked: false, copyCount: "", id: 2 },
		{ order_type: "Pick Up", isChecked: false, copyCount: "", id: 3 },
	]);

	const getPrinters = async () => {
		const { data } = await axiosInstance.get(`/getPrinters`);
		return data;
	};

	const updatePrinterOrderType = async (updateData) => {
		const { data } = await axiosInstance.put(`/assignPrinterToBill`, updateData);
		return data;
	};

	const {
		data: printers,
		isLoading,
		isError,
		isFetching,
		error,
	} = useQuery({
		queryKey: "printers",
		queryFn: getPrinters,
		onSuccess: (data) => {
			const selectedPrinter = data.find((printer) => +printer.id === +printerId);
			setPrinterKotOrderType((prev) => {
				return prev.map((orderType) => {
					const id = orderType.id;
					const isChecked = selectedPrinter.kot_print_ordertypes.includes(id.toString());
					const copyCount = selectedPrinter.kot_print_copy_count.split(",")[id - 1];
					return { ...orderType, isChecked, copyCount };
				});
			});
		},
	});

	const { mutate } = useMutation({
		mutationKey: "printerOrderUpdate",
		mutationFn: updatePrinterOrderType,
		onSuccess: () => queryClient.invalidateQueries(["printers"]),
	});

	let printerName = printers?.find((printer) => +printer.id === +printerId).printer_display_name;

	const handleStatusChange = (e) => {
		const { name, value, type } = e.target;

		setPrinterKotOrderType((prev) => {
			return prev.map((ordertype) => {
				if (ordertype.order_type === name) {
					if (type === "checkbox") {
						return { ...ordertype, isChecked: !ordertype.isChecked };
					} else {
						if (/^[0-9]\d*$/.test(value)) {
							return { ...ordertype, copyCount: value };
						} else {
							return { ...ordertype, copyCount: "" };
						}
					}
				} else {
					return ordertype;
				}
			});
		});
	};

	const handleSave = async () => {
		const kotPrintOrderTypes = printerKotOrderType.reduce((acc, orderType) => (orderType.isChecked ? [...acc, orderType.id] : acc), []).join(",");
		const kotPrintCopyCount = printerKotOrderType.map((ordertype) => ordertype.copyCount || 0).join(",");
		const assignType = "kot";
		const updateData = { assignType, printerId, kotPrintCopyCount, kotPrintOrderTypes };

		mutate(updateData);

		notify("success", "Printer Assigned success");

		// setTimeout(() => navigate(".."), 500);
	};

	return (
		<motion.div
			className={styles.printerAssingnBody}
			initial={{ opacity: 0, scale: 0.98 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.1 }}>
			<header>
				<div className={styles.headerText}> Assign Printer to KOT - {printerName}</div>
				<BackButton onClick={() => navigate("..")} />
			</header>
			<main className={styles.assignBillMain}>
				<div className={styles.assignConfigTable}>
					<div className={styles.tableHeading}>
						<div className={styles.orderType}>Order Type</div>
						<div className={styles.copyCount}>Print Copies</div>
					</div>
					<div className={styles.Tabledata}>
						{isLoading ? (
							<div>Loading...</div>
						) : (
							printerKotOrderType.map((orderType) => {
								return (
									<div
										className={styles.tableRow}
										key={orderType.order_type}>
										<div className={styles.statusControl}>
											<input
												className={styles.checkBox}
												id={orderType.order_type}
												type="checkbox"
												name={orderType.order_type}
												onChange={handleStatusChange}
												checked={orderType.isChecked}
											/>
											<label
												htmlFor={orderType.order_type}
												className={styles.orderTypeName}>
												{orderType.order_type}
											</label>
										</div>
										<div className={styles.countControl}>
											<input
												className={styles.copyCountNumber}
												type="number"
												min="0"
												step="1"
												name={orderType.order_type}
												onChange={handleStatusChange}
												value={orderType.copyCount}
												disabled={!orderType.isChecked}
											/>
										</div>
									</div>
								);
							})
						)}
					</div>
					<div className={styles.tableFooter}>
						<button
							className={styles.cancelBtn}
							onClick={() => navigate("..")}>
							Cancel
						</button>
						<button
							className={styles.saveBtn}
							onClick={handleSave}>
							{" "}
							Save{" "}
						</button>
					</div>
				</div>
			</main>
		</motion.div>
	);
}

export default AssignKot;
