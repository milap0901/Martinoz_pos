import React from "react";
import styles from "./PrinterAssign.module.css";
import { motion } from "framer-motion";
import { useNavigate, useParams} from "react-router-dom";
import BackButton from "../Feature Components/BackButton";
import SettingTile from "../Feature Components/SettingTile";
import { v4 } from "uuid";
import { useQuery } from "react-query";
import axios from "axios";
import { useSelector } from "react-redux";

function PrinterAssign() {
	const { printerId } = useParams();
	const { IPAddress } = useSelector((state) => state.serverConfig);
	

	const navigate = useNavigate();
	const printerAssignItems = [
		{ title: "Assign to KOT", navigateTo: `assignKot` },
		{ title: "Assign to Bill", navigateTo: `assignBill` },
	];

	const getPrinters = async () => {
		const { data } = await axios.get(`http://${IPAddress}:3001/getPrinters`);
		return data;
	};

	const {
		data: printers,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: "printers",
		queryFn: getPrinters,
		enabled : !IPAddress 
	});

	let printerName = printers?.find((printer) => +printer.id === +printerId)?.printer_display_name || "does not exist" ;


	return (
		<motion.div
			className={styles.printerAssingnBody}
			initial={{ opacity: 0, scale: 0.98 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.1 }}>
			<header>
				<div className={styles.headerText}> Assign Printer - {printerName}</div>
				<BackButton onClick={() => navigate("..")} />
			</header>
			<main className={styles.printerAssignMain}>
				{printerAssignItems.map((item) => {
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

export default PrinterAssign;
