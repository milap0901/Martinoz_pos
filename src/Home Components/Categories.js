import React from "react";
import CategoryItem from "./CategoryItem";
import styles from "./Categories.module.css";

function Categories({ categories }) {
	const categoryList = <div className={`${styles.categoryList}`}>{categories.map(cat => (cat.items.length > 0 ? <CategoryItem key={cat.id} cat={cat} /> : null))}</div>;

	return categoryList;
}

export default Categories;
