import React from "react";
import styles from "./SelectItemsToPrint.module.css";

function SelectItemsToPrint({ selectedItems, setSelectedItems, categories,selectedCategory }) {
	const handleChange = (id) => {

		setSelectedItems((prev) => {
			if (prev.selectedItemIds.includes(id)) {
				return { ...prev, selectedItemIds: prev.selectedItemIds.filter((itemId) => itemId !== id) };
			} else {
				return { ...prev, selectedItemIds: [...prev.selectedItemIds, id] };
			}
		});
	};

	return (
		<main className={styles.categoryBody}>
			<header className={styles.header}>
				<div className={styles.heading}>Items</div>
				<div className={styles.allCategoryCheck}>
					<label className={styles.allCategoryCheckLebal}>
						<input
							type="checkbox"
							className={styles.allCategoryCheckInput}
							name="AllItems"
							id="AllItems"
							checked={selectedItems.allSelected}
							onChange={() => setSelectedItems((prev) => ({ ...prev, allSelected: !prev.allSelected }))}
							disabled={selectedCategory.allSelected}
						/>
						All Items
					</label>
				</div>
				<div className={styles.categorySelectNote}>Note: selecting all items will allow all items to print on this printer</div>
			</header>
			<section className={styles.categoryMain}>
				<div className={`${styles.selectCategory} ${ (!selectedItems.allSelected && !selectedCategory.allSelected) ? styles.show : null}`}>
					{categories.map((category) => {
                            
							const isDisabled = selectedCategory.selectedCategoryIds.includes(category.id)

						return category.items.map((item) => {

							const isSelected = selectedItems.selectedItemIds.includes(item.id) || isDisabled;

							return (
								<div
									className={styles.categoryBox}
									key={item.id}>
									<label className={`${styles.categoryCheckLebal} ${isSelected ? styles.active : null}`}>
										<input
											type="checkbox"
											className={styles.categoryCheckInput}
											name={item.name}
											id="category"
											checked={isSelected}
											onChange={() => handleChange(item.id)}
											disabled={ isDisabled}
										/>
										{`${item.display_name.substring(0, 18) }${item.display_name.length > 18 ? ".." : ""}`}
                                        <div className={styles.tooltip}>{item.display_name}</div>
									</label>
								</div>
							);
						});
					})}
				</div>
			</section>
		</main>
	);
}

export default SelectItemsToPrint;
