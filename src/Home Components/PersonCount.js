import React from "react";
import styles from "./PersonCount.module.css";
import { useDispatch, useSelector } from "react-redux";
import { modifyCartData } from "../Redux/finalOrderSlice";
import { AnimatePresence, motion } from "framer-motion";
import { useAutofocus } from "../Utils/useAutofocus";

function PersonCount({ showDetailType }) {
	const dispatch = useDispatch();
	const { personCount } = useSelector(state => state.finalOrder);

	const handleChange = e => {
		let personCount = e.target.value;
		dispatch(modifyCartData({ personCount }));
	};

	const autoFocusRef = useAutofocus(showDetailType,"personCount")
  

	// let showPersonCount = showDetailType === "personCount" ? `${styles.show} ${styles.personCount} ` : `${styles.personCount}`;
	return (
		<AnimatePresence>
			{showDetailType === "personCount" && (
				<motion.div
					layout
					key="tableNumber"
					initial="collapsed"
					animate="open"
					exit="collapsed"
					variants={{
						open: { opacity: 1, originY: 0, height: 55,padding:12 },
						collapsed: { opacity: 0, originY: 0, height: 0 ,padding:0},
					}}
					transition={{ duration: 0.2 }}
					className={styles.personCount}>
					<span className="mx-2">please enter No. of Person</span>
					<input type="number" min="0" value={personCount} onChange={e => handleChange(e)} ref={autoFocusRef  } />
				</motion.div>
			)}
		</AnimatePresence>
	);
}

export default PersonCount;
