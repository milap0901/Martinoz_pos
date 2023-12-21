import { executeKotPrint } from "./executePrint";


export const printModifiedKots = async (finalOrder, kotTokenNo, newKotTokenNo, printers) => {

	if (finalOrder.orderType === "dine_in") {
		finalOrder.kotsDetail.forEach(kot => {
			let isModified = false;
			let kotItems = [];

			finalOrder.orderCart.forEach(item => {
				if (item.kotId === kot.id) {
					kotItems.push(item);
					if (["updated", "removed"].includes(item.itemStatus)) {
						isModified = true;
					}
				}
			});
			if (isModified === true) {
				const kotToPrint = { ...finalOrder, orderCart: kotItems, kotTokenNo: kot.token_no, isModified };

				try {
					executeKotPrint(kotToPrint, printers);
				} catch (error) {
					console.log(error);
				}
			}
		});

		const newKotItems = finalOrder.orderCart.filter(item => item.itemStatus === "new");
		if (newKotItems.length) {
			const newKotToPrint = { ...finalOrder, orderCart: newKotItems, kotTokenNo: newKotTokenNo, isModified: false };

			try {
				executeKotPrint(newKotToPrint, printers);
			} catch (error) {
				console.log(error);
			}
		}
	} else {
		if (finalOrder.orderCart.some(item =>  ["new","updated",'removed'].includes(item.itemStatus))) {
			const kotToPrint = { ...finalOrder, kotTokenNo, isModified: true };
			try {
				executeKotPrint(kotToPrint, printers);
			} catch (error) {
				console.log(error);
			}
		}
	}

	// const itemsByStatus = getItemsByStatus(finalOrder.orderCart);

	// if (itemsByStatus.modified.length && finalOrder.orderType !== "dine_in") {
	// 	finalOrder = { ...finalOrder, kotTokenNo: kotTokenNo, isModified: true };
	// 	try {
	// 		await executeKotPrint(finalOrder, printers);
	// 	} catch (error) {
	// 		console.log(error);
	// 	}
	// }

	// if (itemsByStatus.new.length && finalOrder.orderType === "dine_in") {
	// 	finalOrder = { ...finalOrder, orderCart: itemsByStatus.new, kotTokenNo: newKotTokenNo, isModified: false };
	// 	try {
	// 		await executeKotPrint(finalOrder, printers);
	// 	} catch (error) {
	// 		console.log(error);
	// 	}
	// }

	// if (itemsByStatus.updated.length && finalOrder.orderType === "dine_in") {
	// 	finalOrder = { ...finalOrder, orderCart: itemsByStatus.old, kotTokenNo: kotTokenNo, isModified: true };
	// 	try {
	// 		await executeKotPrint(finalOrder, printers);
	// 	} catch (error) {
	// 		console.log(error);
	// 	}
	// }
};
