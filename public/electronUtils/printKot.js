const { PosPrinter } = require("electron-pos-printer");

const printKot = async payload => {
	const { data, printerName } = payload;
	// const win = new BrowserWindow({width:305,height:1000});

	// const options = {
	// 	silent: false,
	// 	deviceName: "POS-usb",
	// 	margins: {
	// 		marginType: "custom",
	// 		top: 0,
	// 		bottom: 0,
	// 		left: 0,
	// 		right: 0,
	// 	},

	//  pageSize:{width:78000,height:10000}
	// };

	const fullDate = new Date();
	const date = `${fullDate.getDate()}/${fullDate.getMonth() + 1}/${fullDate.getFullYear()}`;
	const time = `${fullDate.getHours()}:${fullDate.getMinutes()}:${fullDate.getSeconds()}`;
	const orderTypedisplayNames = { dine_in: "Dine In", pick_up: "Pick Up", delivery: "Delivery" };
	const itemStatusDisplayName = { removed: "CANCELLED", new: "NEW", updated: "UPDATED", cancelled: "CANCELLED" };

	const htmlContent = `
	<!DOCTYPE html>
	<html>
	<head>
		<title>Print Content</title>
		<style>
			* {
				margin: 0;
				padding: 0;
			}
			body {
				font-family: Arial, sans-serif;
				font-size: 14px;
				width : 100%;
			}
			.printHeader {
				display: flex;
				justify-content: center;
				flex-direction: column;
				border-bottom: 2px dashed;
				padding: 5px 0px;
				align-items: center;
			}
			.bold{
				font-weight: 700;
			}
			.biller{
				padding: 5px;
				border-bottom: 2px dashed;
			}
			.itemTitle{
				display: flex;
      			justify-content: flex-start;
      			align-items: flex-start;
				padding: 5px;
			}
			.itemQtyTitle{
				min-width: 40px;
				text-align : center;
			}
			.itemNameTitle{
				flex-grow: 1;
			}
			.itemCard{
				display: flex;
      			justify-content: flex-start;
      			align-items: flex-start;
				padding: 5px;
			}
			.itemQty{
				min-width : 40px;
				text-align : center ;
			}
			.itemName{
				flex-grow : 1 ;
			}
			.addonCard{
				display: flex;
				font-size: 13px;
				margin: 2px 0px 2px 60px;
				font-style: italic;
			}

			.strikeThrough{
				text-decoration: line-through
			}
		
		</style>
	</head>
	<body>
		<div class="printMain">
			<header class="printHeader">
			    ${data.isModified ? `<div>Duplicate</div> ` : ""}    
			    ${data.isModified ? `<div>Modified</div> ` : ""}    
				<div class="dateAndTime">${date} ${time}</div>
				<div class="kotText bold">KOT - ${data.kotTokenNo}</div>
				<div class="orderType bold">${orderTypedisplayNames[data.orderType]}</div>
				${data.orderType === "dine_in" ? `<div class="tableNo bold">Table No: ${data.tableNumber}</div> ` : ""}
			</header>		
			<section class="biller">Biller - biller</section>
			<section class="itemTitle">
				<div class="itemQtyTitle">Qty.</div>
				<div class="itemNameTitle">Item</div>
			</section>
			<section class="itemContainer">

			${data.orderCart
				.map(item => {
					const itemStatus =
						item.itemStatus !== "default" && data.isModified ? `[${itemStatusDisplayName[item.itemStatus]}]` : "";

					const itemCard = `<article class="itemCard">
										<div class="itemQty">${item.itemQty}</div>
										<div class="itemName bold ${["removed", "cancelled"].includes(item.itemStatus) ? "strikeThrough" : ""}"> ${itemStatus} ${item.itemName} ${
						item.variantName ? " - " + item.variantName : ""
					}</div>
			    					</article>`;

					const addonCard = item.toppings.length
						? item.toppings
								?.map(topping => {
									return `<article class="addonCard">
												<div class="addonName">${topping.name} - </div>
					  							<div class="addonQty">${topping.quantity}</div>
					  						</article>`;
								})
								.join(" ")
						: "";
					return itemCard + addonCard;
				})
				.join(" ")}
			</section>
			
		</div>
	</body>
	</html>
  `;

	// win.loadURL(`data:text/html;charset=UTF-8,${encodeURIComponent(htmlContent)}`);

	// win.once("ready-to-show", () => {
	// 	win.webContents.print(options, (success, errorType) => {
	// 		if (!success) {
	// 			console.log(`Printing failed: ${errorType}`);
	// 		} else {
	// 			console.log("Printing successful.");
	// 		}

	// 		win.close();
	// 	});
	// });

	const kotPrint = [
		{
			type: "text",
			value: htmlContent,
			style: {},
		},
	];

	const options = {
		preview: true,
		margin: "0px 0px 0px 0px",
		silent: true,
		copies: 1,
		printerName: printerName,
		timeOutPerLine: 600,
		pageSize: "76mm", // page size,
		color: false,
		printBackground: false,
		dpi: 300,
	};

	PosPrinter.print(kotPrint, options).catch(error => {
		console.error(error);
	});
};

module.exports = { printKot };
