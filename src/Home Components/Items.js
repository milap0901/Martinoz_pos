import React from "react";
import Item from "./Item";
import styles from "./Items.module.css";
import { useSelector } from "react-redux";
import FlipComponent from "./FlipComponent";

function Items() {
	let items = useSelector(state => state.menuItems.items);

	return (
		<div className={styles.items}>
			{items.map(item => (
				<Item key={item.id} {...item} />
			))}
		</div>
	);
}

export default Items;
