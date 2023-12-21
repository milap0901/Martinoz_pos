import React from "react";
import styles from "./DefaultDisplayOptions.module.css";

function DefaultDisplayOptions({ defaultOptions, setDefaultOptions }) {
	const displayOptions = [
		{
			name: "default_view",
			displayName: "Default order View",
			options: [
				{ name: "table_view", displayName: "Table View" },
				{ name: "billing", displayName: "Billing" },
			],
		},
		{
			name: "order_view_sort",
			displayName: "Live Orders sort",
			options: [
				{ name: "asc", displayName: "Asc" },
				{ name: "desc", displayName: "Desc" },
			],
		},
		{
			name: "kot_view_sort",
			displayName: "KOT View sort",
			options: [
				{ name: "asc", displayName: "Asc" },
				{ name: "desc", displayName: "Desc" },
			],
		},
		{
			name: "default_order_type",
			displayName: "Default order View",
			options: [
				{ name: "dine_in", displayName: "Dine In" },
				{ name: "delivery", displayName: "Delivery" },
				{ name: "pick_up", displayName: "Pick Up" },
			],
		},
		{
			name: "default_payment_type",
			displayName: "Default Payment Type",
			options: [
				{ name: "cash", displayName: "Cash" },
				{ name: "card", displayName: "Card" },
				{ name: "due", displayName: "Due" },
				{ name: "other", displayName: "Other" },
			],
		},
		{
			name: "default_price_type",
			displayName: "Default Price Type",
			options: [
				{ name: "with_tax", displayName: "With Tax" },
				{ name: "without_tax", displayName: "Without Tax" },
			],
		},
	];

	return (
		<div className={styles.defaultDisplayOptionBody}>
			{/* <header className={styles.displayOptionsheader}>Display </header>  */}
			<main className={styles.displayOptionsMain}>
				{displayOptions.map(item => {
					return (
						<div className={styles.optionCard} key={item.name}>
							<div className={styles.optionNameContainer}>
								<div className={styles.optionName}>{item.displayName}</div>
							</div>
							<div className={styles.options}>
								{item.options.map(option => {
									return (
										<div key={option.name} className={styles.option}>
											<input
												type="radio"
												id={`${option.displayName}${item.displayName}`}
												name={item.name}
												checked={defaultOptions[item.name] === option.name}
												onChange={() =>
													setDefaultOptions(prev => ({ ...prev, [item.name]: option.name }))
												}
											/>
											<label htmlFor={`${option.displayName}${item.displayName}`}>
												{option.displayName}
											</label>
										</div>
									);
								})}
							</div>
						</div>
					);
				})}
			</main>
		</div>
	);
}

export default DefaultDisplayOptions;
