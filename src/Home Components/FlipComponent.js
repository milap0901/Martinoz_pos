import React, { useEffect, useState } from "react";
import styles from "./FlipComponent.module.css";
import { AnimatePresence, motion } from "framer-motion";

function FlipComponent() {
	const img = ["a", "b", "c", "d"];

	const [current, setCurrent] = useState(img[0]);

	useEffect(() => {
		const flipInterval = setInterval(() => {
			setCurrent(prev => {
				if (prev === img[img.length - 1]) {
					return img[0];
				} else {
					return img[img.findIndex(ele => ele === prev) + 1];
				}
			});
		}, 3000);

		// Cleanup interval on component unmount
		return () => clearInterval(flipInterval);
	}, [img]);
	console.log(current);

	return (
		<div className={styles.flipContainer}>
			<AnimatePresence>
				{current && (
					<motion.div
						className={styles.front}
						layoutId={current}	
						initial={{ rotateY: 180 }}
						animate={{ rotateY: 0 }}
						exit={{ rotateY: 180 }}
						transition={{
							duration: 2,
							ease: "easeInOut",
						}}>
						{current}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

export default FlipComponent;
