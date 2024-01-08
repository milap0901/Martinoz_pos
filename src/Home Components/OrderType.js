import React from "react";
import styles from "./OrderType.module.css";
import OrderTypeDetail from "./OrderTypeDetail";
import { useSelector, useDispatch } from "react-redux";
import { modifyCartData } from "../Redux/finalOrderSlice";
import { setActive } from "../Redux/UIActiveSlice";
import { useQueryClient } from "react-query";


// three order types
const orderTypesMap = [
	{ name: "dine_in", displayName: "Dine In" },
	{ name: "delivery", displayName: "Delivery" },
	{ name: "pick_up", displayName: "Pick Up" },
];

function OrderType() {

	const queryClient = useQueryClient()
	const dispatch = useDispatch();
	const orderType = useSelector((state) => state.finalOrder.orderType);
	const cartAction = useSelector(state => state.finalOrder.cartAction );
	const orderId = useSelector(state => state.finalOrder.id)
	const kotsDetail = useSelector(state => state.finalOrder.kotsDetail)

	// get default restaurant price from default screen query .
	// note : other option is to get using "defaultScreen" query it self
	const defaultRestaurantPrice = +queryClient.getQueryData("defaultScreen")?.default_restaurant_price || null
	

	// for changing order type
	const handleOrderType = (orderType) => {

		//for delivery and pick up set tableNumber to ""
		if (orderType === "delivery" || orderType === "pick_up") {
			dispatch(modifyCartData({ tableNumber: "" }));
		}

		dispatch(setActive({ key: "restaurantPriceId", name: defaultRestaurantPrice  }));
		dispatch(modifyCartData({ orderType }));
	};


       // OrderDetail will depend on order type 
	return (
		<div className="flex-shrink-0">
			<div className={`d-flex ${styles.orderTypeBtn}`}>
				{orderTypesMap.map((type) => {
					return (
						<button key={type.name}
							className={`flex-grow-1 ${orderType === type.name ? "bg-danger" : "none"}`}
							onClick={() => handleOrderType(type.name)}>
							{type.displayName}
						</button>
					);
				})}
			</div>

			
			<OrderTypeDetail type={orderType} cartAction={cartAction} orderId={orderId} kotsDetail={kotsDetail} />
			
		</div>
	);
}

export default OrderType;
