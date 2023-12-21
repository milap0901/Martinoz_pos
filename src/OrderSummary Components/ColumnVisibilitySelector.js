import React, { useEffect, useRef, useState } from "react";
import styles from "./ColumnVisibilitySelector.module.css";
import ColumnSelector from "./ColumnSelector";
import arrowDown from "../icons/arrow-down.png";

function ColumnVisibilitySelector({ table, setGlobalFilter }) {
	const [showSelector, setShowSelector] = useState(false);
	const outsideRef = useRef();

	useEffect(() => {
		const handleOusideClick = e => {
			if (outsideRef.current && !outsideRef.current.contains(e.target) && e.target.name !== "toggleColumnSelector") {
				setShowSelector(false);
			}
		};
		document.addEventListener("mousedown", handleOusideClick);
		return () => {
			document.removeEventListener("mousedown", handleOusideClick);
		};
	}, [outsideRef, setShowSelector]);

	let timeOut;
	const handleSearch = e => {
		if (timeOut) {
			clearTimeout(timeOut);
		}
		timeOut = setTimeout(() => {
			setGlobalFilter(e.target.value);
		}, 500);
	};

	return (
		<div className={styles.visibilityContainer}>
			<div className={styles.searchContainer}>
				<input type="text" placeholder="Search" onChange={handleSearch} />
			</div>
			<div>
				<button className={styles.columnSelectorToggleBtn} name="toggleColumnSelector" onClick={() => setShowSelector(prev => !prev)}>
					Select Columns <img src={arrowDown} className={`${styles.arrow} ${showSelector ? styles.arrowLeft : null}`} />{" "}
				</button>
				<ColumnSelector showSelector={showSelector} table={table} outsideRef={outsideRef} />
			</div>
		</div>
	);
}

export default ColumnVisibilitySelector;
