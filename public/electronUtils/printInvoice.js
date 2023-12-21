const { PosPrinter } = require("electron-pos-printer");

const printInvoice = async payload => {
	const { data, printerName, defaultSettings } = payload;

	const orderTypeMap = { pick_up: "Pick Up", dine_in: "Dine in", delivery: "Delivery" };

	// console.log(defaultSettings);

	const fullDate = new Date();
	const date = `${fullDate.getDate()}/${fullDate.getMonth() + 1}/${fullDate.getFullYear()}`;
	const time = `${fullDate.getHours()}:${fullDate.getMinutes() < 10 ? `0${fullDate.getMinutes()}` : fullDate.getMinutes()}`;

	const printDataHeader = [
		{
			type: "text",
			value: `${defaultSettings.name} (${defaultSettings.branch})`,
			style: { fontWeight: "700", textAlign: "center", fontSize: "15px", fontFamily: "Roboto" },
		},
		{
			type: "text",
			value: `${defaultSettings.address}`,
			style: { fontWeight: "700", textAlign: "center", fontSize: "15px", fontFamily: "Roboto" },
		},
		{
			type: "text",
			value: `Mob. No. ${defaultSettings.contact}`,
			style: { fontWeight: "700", textAlign: "center", fontSize: "15px", fontFamily: "Roboto" },
		},
		{
			type: "text",
			value: `GST NO. : ${defaultSettings.gstin} `,
			style: {
				fontWeight: "700",
				textAlign: "center",
				fontSize: "15px",
				borderBottom: "1px solid",
				paddingBottom: "3px",
				fontFamily: "Roboto",
			},
		},
	];

	const printDataCustomer = [
		{
			type: "text",
			value: `Name : ${data.customerName || ""} <br> Mobile : ${data.customerContact || ""}`,
			style: { textAlign: "left", fontSize: "13px", margin: "5px 0 0 5px", fontFamily: "Roboto" },
		},
		{
			type: "text",
			value: `Add : ${data.customerAdd || ""} ${data.customerLocality || ""}`,
			style: {
				textAlign: "left",
				fontSize: "13px",
				margin: "0 0 0 5px",
				borderBottom: "1px solid",
				paddingBottom: "3px",
				fontFamily: "Roboto",
			},
		},
		{
			type: "text",
			value: `<div> Date : ${date} </div> <div style="font-weight : bold">  ${orderTypeMap[data.orderType]} <div>`,
			style: {
				textAlign: "left",
				fontSize: "13px",
				display: "flex",
				justifyContent: "space-between",
				margin: "5px 8px 0 8px",
				fontFamily: "Roboto",
			},
		},
		{
			type: "text",
			value: `<div>  ${time} </div> <div>  bill No :${data.orderNo} <div>`,
			style: {
				textAlign: "left",
				fontSize: "13px",
				display: "flex",
				justifyContent: "space-between",
				margin: "2px 8px 0 8px",
				fontFamily: "Roboto",
			},
		},
		{
			type: "text",
			value: `<div> Cashier : biller </div> <div style="font-weight : bold">  Token No :${data.kotTokenNo} <div>`,
			style: {
				textAlign: "left",
				fontSize: "13px",
				display: "flex",
				justifyContent: "space-between",
				margin: "2px 8px 0 8px",
				borderBottom: "1px solid black",
				paddingBottom: "3px",
				fontFamily: "Roboto",
			},
		},
	];

	const printOrderHeader = [
		{
			type: "text",
			value: `<div style="flex : 7" > Item </div>
                  <div style="flex : 2; text-align:center" > QTY </div> 
                  <div style="flex : 3; text-align:center "> Price </div>
                  <div style="flex : 3; text-align:center"> Amount </div>`,
			style: {
				textAlign: "left",
				fontSize: "13px",
				display: "flex",
				justifyContent: "space-between",
				margin: "5px 8px 0 8px",
				borderBottom: "1px solid black",
				paddingBottom: "3px",
				fontWeight: "bold",
				fontFamily: "Roboto",
			},
		},
	];

	let printOrderDetail = [];
	let individualItemsDiscount = 0;

	data.orderCart.forEach(item => {
		const orderitem = {
			type: "text",
			value: `<div style="flex : 7" > ${item.itemName} ${item.variationName ? `[${item.variationName}]` : ""} </div>
                  <div style="flex : 2 ; text-align:center"> x${item.itemQty} </div> 
                  <div style="flex : 3 ; text-align:center" > ${item.itemTotal.toFixed(2)} </div>
                  <div style="flex : 3 ; text-align:right"> ${(item.itemTotal * item.itemQty).toFixed(2)}</div>`,
			style: {
				textAlign: "left",
				fontSize: "13px",
				display: "flex",
				justifyContent: "space-between",
				margin: "5px 8px 5px 8px",
				fontFamily: "Roboto",
			},
		};

		printOrderDetail.push(orderitem);

		if (item.toppings) {
			item.toppings.forEach(topping => {
				const orderTopping = {
					type: "text",
					value: `<div> ${topping.name}[topping] : ${topping.quantity} x ${topping.price.toFixed(0)} = ${(
						topping.price * topping.quantity
					).toFixed(2)}  </div>`,
					style: {
						textAlign: "left",
						fontStyle: "italic",
						fontSize: "12px",
						display: "flex",
						justifyContent: "start",
						margin: "5px 8px 5px 20px",
						fontFamily: "Roboto",
					},
				};

				printOrderDetail.push(orderTopping);
			});
		}

		if (item.discount_detail.length) {
			item.discount_detail.forEach(discount => {
				if ((discount.type === "offer" && discount.discount) || (discount.type === "promo" && discount.discount === item.itemTotal)) {
					const discountRow = {
						type: "text",
						value: `<div style="flex : 12; fontStyle:"italic"" > Discount (${discount.d_name})</div>
							  <div style="flex : 3 ; text-align:right"> - ${(discount.discount * item.itemQty).toFixed(2)}</div>`,
						style: {
							textAlign: "left",
							fontSize: "13px",
							display: "flex",
							justifyContent: "space-between",
							margin: "5px 8px 5px 8px",
							fontFamily: "Roboto",
						},
					};
					individualItemsDiscount += discount.discount * item.itemQty;
					printOrderDetail.push(discountRow);
				}
			});
		}
	});

	const printTotal = [
		
		{
			type: "text",
			value: `<div style="flex : 7; 	text-align : right " > Item Qty : </div>
							  <div style="flex : 2 ; text-align:center"> ${data.totalQty} </div> 
							  <div style="flex : 3 ; text-align:right ; white-space: nowrap"> Total : </div>
							  <div style="flex : 3 ; text-align:right"> ${(data.subTotal - individualItemsDiscount).toFixed(2)}</div>`,
			style: {
				textAlign: "left",
				fontSize: "13px",
				display: "flex",
				justifyContent: "space-between",
				borderTop: "1px solid black",
				margin: "5px 8px 0px 8px",
				padding: "5px 0px",
				fontFamily: "Roboto",
			},
		},
	];

	if (data.discount - individualItemsDiscount > 0) {
		printTotal.push({
			type: "text",
			value: `<div style="flex : 7;" ></div>
				  <div style="flex : 5 ; text-align:right; white-space: nowrap""> Discount : </div>
				  <div style="flex : 3 ; text-align:right">  ${(data.discount - individualItemsDiscount).toFixed(2)}</div>`,
			style: {
				textAlign: "left",
				fontSize: "13px",
				display: "flex",
				justifyContent: "space-between",
				margin: "2px 8px 5px 8px",
				fontFamily: "Roboto",
			},
		});
	}

	let printTotalTax = [];

	data?.taxDetails?.forEach(tax => {
		printTotalTax.push({
			type: "text",
			value: `<div style="flex : 7;" ></div>
				  <div style="flex : 5 ; text-align:right; white-space: nowrap""> ${tax.name}(${tax.tax_percent}%) : </div>
				  <div style="flex : 3 ; text-align:right">  ${tax.tax.toFixed(2)}</div>`,
			style: {
				textAlign: "left",
				fontSize: "13px",
				display: "flex",
				justifyContent: "space-between",
				margin: "2px 8px 5px 8px",
				fontFamily: "Roboto",
			},
		});
	});

	console.log(data.paymentMethod)

	let paymentType = "";
	if (data.online_order_id) {
		if (data.paymentMethod === "cod") {
			paymentType = "Cash on Delivery";
		} else {
			paymentType = "Paid Online";
		}
	}

	const printFooter = [
		{
			type: "text",
			value: `<div style="flex : 5;" ></div>
				  <div style="flex : 7 ; text-align:right; white-space: nowrap"> Grand Total :  </div>
				  <div style="flex : 3 ; text-align:right ; white-space: nowrap ; padding-left: 4px ">  ₹ ${data.cartTotal.toFixed(2)}</div>`,
			style: {
				// textAlign: "left",
				fontSize: "13px",
				display: "flex",
				fontWeight: "bold",
				padding: "5px 0",
				justifyContent: "space-between",
				margin: "0px 8px 5px 8px",
				fontFamily: "Roboto",
				borderTop: "1px solid black",
			},
		},

		{
			type: "text",
			value: `<div > ${paymentType} </div>`,
			style: {
				textAlign: "left",
				fontSize: "12px",
				display: "flex",
				justifyContent: "flex-start",
				margin: "0px 8px 0 8px",
				borderBottom: "1px solid black",
				padding: "5px 10px",
				fontFamily: "Roboto",
			},
		},
		{
			type: "text",
			value: `<div > FSSAI Lic NO. ${defaultSettings.fssai} </div>
                  <div > ${defaultSettings.invoice_f_m} </div>`,
			style: { textAlign: "center", fontSize: "12px", margin: "5px 8px 0 8px", fontFamily: "Roboto", fontWeight: "bold" },
		},
	];

	const printData = [
		...printDataHeader,
		...printDataCustomer,
		...printOrderHeader,
		...printOrderDetail,
		...printTotal,
		...printTotalTax,
		...printFooter,
	];

	const options = {
		preview: true, // set it to fals for actual print
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

	PosPrinter.print(printData, options).catch(error => {
		console.error(error);
	});
};

module.exports = { printInvoice };
