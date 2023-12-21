import React from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useNavigate } from "react-router-dom";

function useDeployHotkeys() {
	const navigate = useNavigate();

	useHotkeys("ctrl+o", () => navigate("LiveView/OrderView"));
	useHotkeys("ctrl+h", () => navigate("/Home"));
	useHotkeys("ctrl+k", () => navigate("LiveView/KOTView"));
	useHotkeys("ctrl+p", () => navigate("configuration/printerConfig/PrintersList"));
	useHotkeys("ctrl+t", () => navigate("tableView"));
	useHotkeys("ctrl+s", e => {
		e.preventDefault();
		navigate("reports/ordersSummary");
	});
}

export default useDeployHotkeys;
