import React from "react";
import styles from "./OrderView.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faBorderAll, faUtensils, faPersonBiking, faBasketShopping, faWifi, faPersonDotsFromLine } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { setActive } from "../Redux/UIActiveSlice";
import { useQueryClient } from "react-query";
import OrderCard from "./OrderCard";
import { AnimatePresence, motion } from "framer-motion";

import useSocket from "../Utils/useSocket";
import { useGetLiveOrdersQuery } from "../Utils/customQueryHooks";
import Loading from "../Feature Components/Loading";

function OrderView() {
	const queryClient = useQueryClient();
	const dispatch = useDispatch();
	const { liveViewOrderType } = useSelector(state => state.UIActive);
	const sortType = useSelector(state => state.bigMenu.defaultSettings.order_view_sort);

	const swiggy = (
		<svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 24 24" id="swiggy" width="20px" height="20px">
			<path d="M12.878,5.92841a.297.297,0,0,1,.31378.335c.002.09192.00348.18384.0036.27575.00061.59241-.00238,1.18488.00208,1.77723.00329.43353.07947.517.49939.56909a14.83182,14.83182,0,0,0,3.14795-.04578,4.94837,4.94837,0,0,0,1.57287-.37384.50722.50722,0,0,0,.34461-.60242,6.83113,6.83113,0,0,0-5.3432-5.71106,6.60826,6.60826,0,0,0-3.64844.243A6.718,6.718,0,0,0,7.07709,4.147,6.27211,6.27211,0,0,0,5.23022,8.43164,11.18781,11.18781,0,0,0,6.7558,13.9494a1.34216,1.34216,0,0,0,1.32989.74726c.65332-.01569,1.30732-.00354,1.96106-.00354v-.00348q1.04187,0,2.08368.00048c.24927.00055.44654.06012.44458.37226-.00458.72522.00067,1.45044-.00335,2.1756-.00129.22015-.06324.432-.32612.43408-.26391.00207-.32641-.20893-.32971-.42951-.00512-.34716.00019-.69452.00061-1.04174.00049-.45105-.07342-.55677-.52319-.639a7.70231,7.70231,0,0,0-2.348-.0199,2.5959,2.5959,0,0,0-.80054.19476c-.21185.09973-.29608.24506-.19318.46729.10706.23126.20691.46728.3332.68786a43.875,43.875,0,0,0,3.42651,4.95569c.15393.19947.27313.20362.43109.0105.34869-.42639.71491-.83856,1.05994-1.26788a34.22649,34.22649,0,0,0,3.57635-5.25989,14.17129,14.17129,0,0,0,1.49451-3.87146A1.20324,1.20324,0,0,0,17.36145,9.824,6.94268,6.94268,0,0,0,15.691,9.66235c-.909-.00677-1.81812-.00348-2.72717-.00268-.24481.00024-.42688-.07007-.42707-.3573-.00048-1.01117-.00183-2.0224.00184-3.03351C12.53943,6.053,12.64349,5.92041,12.878,5.92841Z"></path>
		</svg>
	);

	const zomato = (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="zomato" width="18px" height="18px">
			<path d="M20.809 0H3.191A3.2 3.2 0 0 0 0 3.191v8.118c2.872.142 3.51.071 4.396-.035.886-.106 2.056-1.418 2.056-1.418s1.099-1.666 3.722-2.375c2.588-.709 5.991.532 5.991.532 4.112 1.453 4.183 3.9 4.183 3.9v.213s-.071 2.411-4.183 3.864c0 0-3.403 1.276-5.991.567-2.623-.709-3.722-2.411-3.722-2.411s-1.17-1.312-2.056-1.418S2.872 12.55 0 12.691v8.118A3.177 3.177 0 0 0 3.191 24H20.81A3.177 3.177 0 0 0 24 20.809V3.191A3.2 3.2 0 0 0 20.809 0z"></path>
		</svg>
	);

	const controls = [
		{ name: "all", display_name: "All", icon: <FontAwesomeIcon icon={faBorderAll} /> },
		{ name: "dine_in", display_name: "Dine In", icon: <FontAwesomeIcon icon={faUtensils} /> },
		{ name: "delivery", display_name: "Delivery", icon: <FontAwesomeIcon icon={faPersonBiking} /> },
		{ name: "pick_up", display_name: "Pick Up", icon: <FontAwesomeIcon icon={faBasketShopping} /> },
		{ name: "online", display_name: "Online", icon: <FontAwesomeIcon icon={faWifi} /> },
		{ name: "other", display_name: "Other", icon: <FontAwesomeIcon icon={faPersonDotsFromLine} /> },
		{ name: "swiggy", display_name: "Swiggy", icon: swiggy },
		{ name: "zomato", display_name: "Zomato", icon: zomato },
	];

	const handleControl = name => {
		const key = "liveViewOrderType";
		dispatch(setActive({ name, key }));
	};

	const { data: orders, isLoading, isError } = useGetLiveOrdersQuery();

	useSocket("orders", orders => {
		queryClient.setQueryData("liveOrders", orders);
	});

	if (isLoading) {
		return <Loading />;
	}

	if (isError) {
		return <div>something went wrong...</div>;
	}

	return (
		
		<motion.div className={styles.orderView} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.15 }} exit={{ opacity: 0, scale: 0.9 }}>
			<div className={styles.orderViewControl}>
				<button className={styles.searchBtn}>
					<FontAwesomeIcon icon={faMagnifyingGlass} />
				</button>
				<div className={styles.controls}>
					{controls.map(control => {
						return (
							<div key={control.name} className={styles.control} onClick={() => handleControl(control.name)}>
								<div className={styles.icon}>{control.icon}</div>
								<div className={styles.name}>{control.display_name}</div>
								{liveViewOrderType === control.name && <motion.div layoutId="underline" transition={{ duration: 0.2 }} className={styles.overline}></motion.div>}
							</div>
						);
					})}
				</div>
				<input placeholder="Enter Order No." className={styles.orderInput} />
				<button className={styles.mfrBtn}>MFR</button>
			</div>
			<div className={styles.OrderViewMain}>
				<AnimatePresence>
					{orders?.length !== 0
						? orders
								?.filter(order => (liveViewOrderType === "all" ? true : order.order_type === liveViewOrderType))
								.sort((a, b) => (sortType === "asc" ? a.id - b.id : b.id - a.id))
								.map((order, idx) => <OrderCard order={order} key={order.id} idx={idx} />)
						: null}
				</AnimatePresence>
			</div>
		</motion.div>
	);
}

export default OrderView;
