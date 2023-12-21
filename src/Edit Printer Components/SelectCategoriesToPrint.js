import React from "react";
import styles from "./SelectCategoriesToPrint.module.css";

function SelectCategoriesToPrint({ selectedCategory, setSelectedCategory, categories,setSelectedItems }) {
	const handleChange = (id) => {
		setSelectedCategory((prev) => {
			if (prev.selectedCategoryIds.includes(id)) {
				return { ...prev, selectedCategoryIds: prev.selectedCategoryIds.filter((categoryId) => categoryId !== id) };
			} else {
				return { ...prev, selectedCategoryIds: [...prev.selectedCategoryIds, id] };
			}
		});
	};

	const handleAllCategoryChange = (e) => {


		setSelectedCategory((prev) => ({ ...prev, allSelected: !prev.allSelected }));
		setSelectedItems(prev => ({...prev, allSelected: e.target.checked}))
		
		
	};
	return (
		<main className={styles.categoryBody}>
			<header className={styles.header}>
				<div className={styles.heading}>Category</div>
				<div className={styles.allCategoryCheck}>
					<label className={styles.allCategoryCheckLebal}>
						<input
							type="checkbox"
							className={styles.allCategoryCheckInput}
							name="Allcategory"
							id="Allcategory"
							checked={selectedCategory.allSelected}
							onChange={handleAllCategoryChange}
						/>
						All Category
					</label>
				</div>
				<div className={styles.categorySelectNote}>Note: selecting all category will allow all categories to print on this printer</div>
			</header>
			<section className={styles.categoryMain}>
				<div className={`${styles.selectCategory} ${!selectedCategory.allSelected ? styles.show : null}`}>
					{categories.map((category) => {
						const isSelected = selectedCategory.selectedCategoryIds.includes(category.id);
						return (
							<div
								className={styles.categoryBox}
								key={category.id}>
								<label className={`${styles.categoryCheckLebal} ${isSelected ? styles.active : null}`}>
									<input
										type="checkbox"
										className={styles.categoryCheckInput}
										name={category.name}
										id="category"
										checked={isSelected}
										onChange={() => handleChange(category.id)}
									/>
									{category.display_name}
								</label>
							</div>
						);
					})}
				</div>
			</section>
		</main>
	);
}

export default SelectCategoriesToPrint;
