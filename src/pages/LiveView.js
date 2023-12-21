import React from "react";
import LiveViewNav from "../Live View Components/LiveViewNav";
import { Outlet } from "react-router-dom";
import styles from "./LiveView.module.css";
import { AnimatePresence } from "framer-motion";

function LiveView() {
	return (
		<div className={styles.liveView}>
			<LiveViewNav />

			<Outlet />
		</div>
	);
}

export default LiveView;
