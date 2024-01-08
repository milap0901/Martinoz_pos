import React, { useRef } from "react";
import styles from "./MainMenu.module.css";
import Categories from "./Categories";
import Items from "./Items";
import { useSelector, useDispatch } from "react-redux";
import { setMenuItems } from "../Redux/menuItemsSlice";
import { useGetMenuQuery2 } from "../Utils/customQueryHooks";
import Loading from "../Feature Components/Loading";

function MainMenu() {
	const dispatch = useDispatch();

	// custom get menu query to get initial data
	const { isLoading, data: bigMenu } = useGetMenuQuery2();

	const categories = bigMenu?.categories || [];

	const activeCategoryId = useSelector(state => state.menuItems.id);
	const isCartActionDisable = useSelector(state => state.UIActive.isCartActionDisable);
	const searchItemRef = useRef("");


	// handle change function for item search 
	const handleChange = () => {
		let searchTerm = searchItemRef.current.value;
		let searchItem = [];

		// run this for min char length of 3
		if (searchTerm.length >= 3) {
			//get items from main menu that matches search string
			categories.forEach(category => {
				category.items.forEach(item => {
					if (item.name.toLowerCase().includes(searchTerm.toLowerCase())) {
						searchItem.push(item);
					}
				});
			});
		}
		// if search term length is 0 or search box is empty reset menuItems to selected active id that was acquired from activeCategoryId

		if (searchTerm.length === 0 && activeCategoryId) {
			let { items } = categories.find(category => category.id === activeCategoryId);
			dispatch(setMenuItems({ items, id: activeCategoryId }));
			return;
		}
		
		
		dispatch(setMenuItems({ items: searchItem, id: activeCategoryId }));
	};

	if (isLoading) {
		return <Loading />;
	}

	return (
		<div className={styles.mainMenu} style={isCartActionDisable ? { pointerEvents: "none", color: "gray" } : null}>
			{/* item search bar */}

			<div className={styles.itemSearchContainer}>
				<input type="text" className={`${styles.itemSearch} border-0 ps-3 py-1`} ref={searchItemRef} placeholder="Search item" onChange={handleChange} />
			</div>

			<div className={styles.displayMenu}>
				<Categories categories={categories} />
				<Items />
			</div>
		</div>
	);
}

export default MainMenu;
