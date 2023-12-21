import React from "react";
import MainMenu from "../Home Components/MainMenu.js";
import MainCart from "../Home Components/MainCart.js";
import styles from "./Home.module.css";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";


function Home() {
	return (
		<motion.div
			className={`${styles.home} d-flex flex-shrink-1 px-0 py-0 overflow-hidden`}
			initial={{ opacity: 0, scale: 0.98 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.1 }}>
			<MainMenu />
			<MainCart />
			
		</motion.div>
	);
}

export default Home;



