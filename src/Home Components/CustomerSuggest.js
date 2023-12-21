import React, { useEffect, useRef } from "react";
import styles from "./CustomerSuggest.module.css";
import { useDispatch } from "react-redux";
import { setCustomerDetail } from "../Redux/finalOrderSlice";
import { motion } from "framer-motion";

function CustomerSuggest({ suggestions, setSuggestions }) {
	const dispatch = useDispatch();

	const handleClick = data => {
		dispatch(setCustomerDetail(data));
		setSuggestions([]);
	};

	const suggestRef = useRef();
	useEffect(() => {
		const handleOusideClick = e => {
			if (suggestRef.current && !suggestRef.current.contains(e.target)) {
				setSuggestions([]);
			}
		};
		//   bind full document for listening click
		document.addEventListener("mousedown", handleOusideClick);

		return () => {
			// Unbind the event listener on clean up
			document.removeEventListener("mousedown", handleOusideClick);
		};
	}, [suggestRef, setSuggestions]);

	return (
		<motion.div
			layout
			key="suggest"
			initial="collapsed"
			animate="open"
			exit="collapsed"
			variants={{
				open: { opacity: 1, originY: 0, height: "fit-content" },
				collapsed: { opacity: 0, originY: 0, height: 0 },
			}}
			transition={{ duration: 0.2 }}
			className={styles.mainSuggest}
			ref={suggestRef}>
			{suggestions.map((suggestion, idx1) => {
				if (!suggestion.addresses.length) {
					return <li key={idx1} className={styles.suggestionOption} onClick={() => handleClick(suggestion)}>{`${suggestion.number}-${suggestion.name}`}</li>;
				} else {
					return suggestion.addresses.map((address, idx2) => {
						return (
							<li
								key={idx2}
								className={styles.suggestionOption}
								onClick={() =>
									handleClick({
										...suggestion,
										addresses: [address],
									})
								}>{`${suggestion.number}-${suggestion.name}-${address.complete_address}-${address.landmark}`}</li>
						);
					});
				}
			})}
		</motion.div>
	);
}

export default CustomerSuggest;
