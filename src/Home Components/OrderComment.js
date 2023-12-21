import React from "react";
import styles from "./OrderComment.module.css";
import { useDispatch, useSelector } from "react-redux";
import { modifyCartData } from "../Redux/finalOrderSlice";
import { AnimatePresence, motion } from "framer-motion";
import { useAutofocus } from "../Utils/useAutofocus";

function OrderComment({ showDetailType }) {
	let { orderComment } = useSelector(state => state.finalOrder);
	let dispatch = useDispatch();

	const handleChange = e => {
		let orderComment = e.target.value;
		dispatch(modifyCartData({ orderComment }));
	};

	const autoFocusRef = useAutofocus(showDetailType,"orderComment")
	
	return (
		<AnimatePresence>
			{
				showDetailType==="orderComment" && <motion.div
					layout
					key="orderComments"
					initial="collapsed"
					animate="open"
					exit="collapsed"
					variants={{
						open: { opacity: 1, originY: 0, height: 120,padding:10 },
						collapsed: { opacity: 0, originY: 0, height: 0,padding:0 },
					}}
					transition={{ duration: 0.2 }}
					className={styles.orderComment}>
					<label className="mx-2">Order Comment :</label>
					<textarea value={orderComment} onChange={e => handleChange(e)} ref={autoFocusRef} />
				</motion.div>
			}
		</AnimatePresence>
	);
}

export default OrderComment;
