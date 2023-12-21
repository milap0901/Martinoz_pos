import React from "react";
import styles from "./CategoryItem.module.css";
import { useDispatch, useSelector } from "react-redux";
import { setMenuItems } from "../Redux/menuItemsSlice";
import { motion } from "framer-motion";

function CategoryItem({ cat }) {
	const dispatch = useDispatch();
	const isCartActionDisable = useSelector(state => state.UIActive.isCartActionDisable);
	const id = useSelector(state => state.menuItems.id);

	// get items list from bigMenu redux state according to active category id and set menuItem redux state with aquired items

	const handleClick = (id, items) => {
		dispatch(setMenuItems({ items, id }));
	};
	let selected = id === cat.id ? styles.selected : "";

	return (
		<div
			className={`${styles.catagoryItem} ${selected}`}
			onClick={() => {
				handleClick(cat.id, cat.items);
			}}>
			{cat.display_name}
			{id === cat.id && <motion.div layoutId="category" transition={{ duration: 0.2 }} className={styles.activeCatBackdrop}></motion.div>}
		</div>
	);
}

export default CategoryItem;
