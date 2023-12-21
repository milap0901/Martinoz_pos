const { getDb } = require("../common/getDb");
const db2 = getDb();

const convertPendingOrderToOrder = (pendingOrder, updatedStatus, biller) => {
	const itemStmt = db2.prepare("SELECT id,category_id,name,price,item_tax,price_type,parent_tax FROM items WHERE id = ?");
	const itemRestaurantPriceStmt = db2.prepare(
		"SELECT price FROM item_restaurant_prices WHERE item_id =? AND (restaurant_price_id = ? OR restaurant_price_id IS NULL) "
	);
	const taxesStmt = db2.prepare("SELECT id,name,tax FROM taxes WHERE id=?");
	const variationStmt = db2.prepare(
		"SELECT price FROM item_variation WHERE item_id = ? AND variation_id=? AND (restaurant_price_id = ? OR restaurant_price_id IS NULL)"
	);
	const toppingStmt = db2.prepare("SELECT price FROM addongroupitems WHERE id=?");

	const orderDetail = pendingOrder.order_json;
	let subTotal = 0;
	let totalCartTaxAmount = 0;
	let totalCartQty = 0;
	let cartTaxDetail = [];

	try {
		const orderCart = orderDetail.order_item.map(item => {
			let basePrice;
			let toppings = [];
			let toppingTotal = 0;
			let totalTaxPercent = 0;

			totalCartQty += +item.quantity;
			const itemDetail = itemStmt.get([item.item_id]);
			const itemTaxArray = itemDetail.item_tax ? itemDetail.item_tax.split(",") : [];

			const item_tax = itemTaxArray.map(tax => {
				const taxData = taxesStmt.get([+tax]);
				totalTaxPercent += taxData.tax;
				return taxData;
			});

			if (item.variation_id === null) {
				if (pendingOrder.restaurant_price_id === null) {
					basePrice = itemDetail.price_type === 1 ? itemDetail.price / (1 + totalTaxPercent / 100) : itemDetail.price;
				} else {
					const restaurantPrice = itemRestaurantPriceStmt.get([item.item_id, pendingOrder.restaurant_price_id]);
					basePrice = itemDetail.price_type === 1 ? restaurantPrice.price / (1 + totalTaxPercent / 100) : restaurantPrice.price;
				}
			} else {
				const variationPrice = variationStmt.get([item.item_id, item.variation_id, pendingOrder.restaurant_price_id]);
				basePrice = itemDetail.price_type === 1 ? variationPrice.price / (1 + totalTaxPercent / 100) : variationPrice.price;
			}

			if (item.addongroupitems.length) {
				toppings = item.addongroupitems.map(topping => {
					const toppingData = toppingStmt.get([topping.addongroupitem_id]);

					const price = itemDetail.price_type === 1 ? +toppingData.price / (1 + totalTaxPercent / 100) : +toppingData.price;
					toppingTotal += price * +topping.quantity;

					return {
						id: +topping.addongroupitem_id,
						name: topping.name,
						price,
						quantity: +topping.quantity,
					};
				});
			}

			const itemTotal = basePrice + toppingTotal;
			let item_discount = +item.item_discount;

			subTotal += itemTotal * +item.quantity;

			const itemTax = item_tax.map(tax => {
				const itemTaxAmount = (itemTotal - item_discount) * (tax.tax / 100) * +item.quantity;
				totalCartTaxAmount += itemTaxAmount;

				let existingTax = cartTaxDetail.find(totaltax => totaltax.id === +tax.id);
				if (existingTax) {
					existingTax.tax += itemTaxAmount;
				} else {
					cartTaxDetail.push({ id: +tax.id, name: tax.name, tax: itemTaxAmount, tax_percent: tax.tax });
				}

				return {
					id: +tax.id,
					name: tax.name,
					tax: (itemTotal - item_discount) * (tax.tax / 100),
				};
			});

			// console.log( JSON.parse(item.discount_details))

			return {
				itemStatus: "default",
				itemQty: +item.quantity,
				itemId: +item.item_id,
				categoryId: +itemDetail.category_id,
				itemName: item.item_name,
				variation_id: +item.variation_id || null,
				variant_display_name: item.variation_name,
				variationName: item.variation_name,
				variantName: item.variation_name,
				basePrice,
				toppings,
				itemTotal,
				parent_tax: itemDetail.parent_tax,
				itemTax,
				itemNotes: "",
				kotId: null,
				multiItemTotal: itemTotal * +item.quantity,
				currentOrderItemId: null,
				item_discount,
				contains_free_item: item.contains_free_item,
				is_it_free_item: item.is_it_free_item,
				discount_detail: item.discount_details ? JSON.parse(item?.discount_details) : [],
			};
		});

		console.log(orderDetail.payment_type)

		const finalOrder = {
			online_order_id: pendingOrder.online_order_id,
			online_order_number: pendingOrder.online_order_number,
			kotsDetail: [],
			biller_name: biller.biller_name,
			biller_id: biller.biller_id,
			id: "",
			printCount: 1,
			customerName: orderDetail.customer.customer_name,
			customerContact: orderDetail.customer.phone,
			customerAdd: orderDetail.customer.address,
			customerLocality: "",
			tableArea: "Other",
			paymentMethod: orderDetail.order.payment_type,
			deliveryCharge: +orderDetail.order.delivery_charges || 0,
			packagingCharge: +orderDetail.order.packing_charges || 0,
			discount: +orderDetail.order.discount_total || 0,
			tableNumber: orderDetail.order.table_no || "",
			personCount: orderDetail.order.no_of_persons || 0,
			orderType: orderDetail.order.order_type,
			orderComment: orderDetail.order.description,
			order_status: updatedStatus,
			discount_percent: null,
			tax: totalCartTaxAmount,
			subTotal,
			cartTotal: subTotal + totalCartTaxAmount - +orderDetail.order.discount_total,
			orderCart,
			taxDetails: cartTaxDetail,
			totalQty: totalCartQty,
			promo_id: +orderDetail.order.promo_id,
			promo_code: orderDetail.order.promo_code,
			promo_discount: +orderDetail.order.promo_discount,
		};
		return finalOrder;
	} catch (error) {
		console.log(error);
		return undefined;
	}
};

module.exports = { convertPendingOrderToOrder };
