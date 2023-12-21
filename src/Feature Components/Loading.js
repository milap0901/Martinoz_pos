import React from "react";
import styles from "./Loading.module.css"
function Loading() {
	return (
		<div className={styles.container}>
		<div className={styles.ellipsis}>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
		</div>
		</div>
	);
}

export default Loading;


// [
//     {
//         "id":1,
//         "web_id":null,
//         "restaurant_id":1,
//         "user_id":123,
//         "token_no":123,
//         "order_type":"dine_in",
//         "customer_name":"abc",
//         "phone_number":1234567896,
//         "address":"abcdd",
//         "landmark":"abcd",
//         "table_id":36,
//         "table_no":1,
//         "print_count":2,
//         "kot_status":"accepted",
//         "order_id":1,
//         "kot_items":[{
//             "id":1,
//             "web_id":null,
//             "item_id":1,
//             "item_name":"abc",
//             "quantity":1,
//             "description":"abc",
//             "variation_id":1,
//             "variation_name":"abc",
//             "tax_id":2,
//             "item_addonitems":[{"id":1}],
//             "price":25,
//             "status":0,
//             "created_at":"2023-12-12 11:15:55",
//             "updated_at":"2023-12-12 11:15:55"
//         }],
//         "created_at":"2023-12-12 11:15:55",
//         "updated_at":"2023-12-12 11:15:55"
//     }
// ]