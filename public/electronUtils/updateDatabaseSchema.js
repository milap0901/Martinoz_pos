const updateDatabaseSchema = (latestDbVersion, db2) => {
	try {
		const currentDbVersionRow = db2.prepare("SELECT value FROM startup_config WHERE name='db_version'").get();
		const currentDbVersion = +currentDbVersionRow.value;

		if (currentDbVersion !== latestDbVersion) {
			const updateMaps = [
				{
					targetVersion: 2,
					action: async () => {
						// Function to create a new table
						const createTableQuery = `CREATE TABLE IF NOT EXISTS "update_demo" (
                            "id" INTEGER NOT NULL,
                            "column_1" TEXT DEFAULT NULL,
                            PRIMARY KEY("id" AUTOINCREMENT)
                        )`;
						await db2.prepare(createTableQuery).run();
						console.log("Table 'update_demo' created.");
					},
				},
				{
					targetVersion: 3,
					action: async () => {
						// Function to add a new column
						const addColumnQuery = `ALTER TABLE "update_demo" ADD "salary" INT`;
						await db2.prepare(addColumnQuery).run();
						console.log("Column 'salary' added.");
					},
				},
				{
					targetVersion: 4,
					action: async () => {
						// Function to add a new column
						const addColumnQuery = `ALTER TABLE "update_demo" ADD "salary_2" INT`;
						await db2.prepare(addColumnQuery).run();
						console.log("Column 'salary' added.");
					},
				},
				// {
				// 	targetVersion: 5,
				// 	action:  () => {
				// 		// Function to add a new column
				// 		const addchildIds =  `ALTER TABLE "taxes" ADD "child_ids" varchar(255) DEFAULT NULL`
				// 		const addparentTaxRow = `INSERT INTO taxes (restaurant_id,name,tax,order_types,status,priority,child_ids) VALUES (?,?,?,?,?,?,?) WHERE id=?`
				// 		const addPriceType = `ALTER TABLE "items" ADD "price_type" INTEGER DEFAULT 1`;
				// 		const addParentTax = `ALTER TABLE "items" ADD "parent_tax" INTEGER DEFAULT 5`;
				// 		const addTaxToOrderItemsColumn = `ALTER TABLE order_items ADD COLUMN tax REAL` ;
				// 		const addTaxIdToOrderItemsColumn =  `ALTER TABLE order_items ADD COLUMN tax_id INTEGER`
				// 		const addTaxToKotItemsColumn = `ALTER TABLE kot_items ADD COLUMN tax REAL` ;
				// 		const addTaxIdToKotItemsColumn =  `ALTER TABLE order_items ADD COLUMN tax_id INTEGER`
				// 		const updatedefaultConfig = "UPDATE restaurants SET configuration=?" ;

				// 		db2.prepare(addchildIds).run()
				// 		db2.prepare(addparentTaxRow).run([1,"GST",5,'1,2,3',1,3,'3,4'])

				// 	},
				// }
				// Add more target versions and corresponding actions here
			];

			db2.transaction(async () => {
				for (const map of updateMaps) {
					if (map.targetVersion > currentDbVersion && map.targetVersion <= latestDbVersion) {
						await map.action(); // Execute the corresponding action
					}
				}

				db2.prepare("UPDATE startup_config SET value = ? WHERE name = 'db_version'").run(latestDbVersion);
			})();
		}
	} catch (error) {
		console.error(error);
	}
};

module.exports = { updateDatabaseSchema };
