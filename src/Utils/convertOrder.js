export const convertOrder = order => {
	const totalTaxes = [];
	let totalQty = 0;

	const orderCart = order.items.map(item => {
		const addonTotal = item.itemAddons.reduce((total, addon) => (total += +addon.price * +addon.quantity), 0);
		totalQty += item.quantity;

		item.itemTax.forEach(tax => {
			let existingTax = totalTaxes.find(totaltax => totaltax.id === tax.tax_id);

			if (existingTax) {
				existingTax.tax_amount += tax.tax_amount * item.quantity;
			} else {
				totalTaxes.push({ id: tax.tax_id, name: tax.tax_name, tax_amount: tax.tax_amount * item.quantity });
			}
		});

		return {
			currentOrderItemId: item.id,
			itemQty: item.quantity,
			itemId: item.item_id,
			itemName: item.item_name,
			variation_id: item.variation_id,
			variationName: item.variation_name || "",
			basePrice: item.price - addonTotal,
			toppings: item.itemAddons,
			itemTotal: item.price,
			multiItemTotal: item.final_price,
			itemTax: item.itemTax,
			discount_detail: item.discount_detail,
		};
	});

	const kotTokenNo = order.KOTDetail.map(kot => kot.token_no).join(",");

	return {
		online_order_id: order.extra_data.online_order_id,
		online_order_number: order.extra_data.pending_order_id,
		kotTokenNo,
		printCount: order.print_count,
		orderNo: order.bill_no,
		customerName: order.customer_name,
		customerContact: order.phone_number,
		customerAdd: order.complete_address,
		subTotal: order.item_total,
		tax: order.total_tax,
		promo_code: order.promo_code,
		promo_id: order.promo_id,
		promo_discount: order.promo_discount,
		deliveryCharge: order.delivery_charges,
		packagingCharge: 0,
		discount: order.total_discount,
		paymentMethod: order.payment_type,
		tableNumber: order.dine_in_table_no,
		orderType: order.order_type,
		cartTotal: order.total,
		orderComment: order.description,
		id: order.id,
		order_status: order.order_status,
		orderCart,
		totalTaxes,
		totalQty,
		billPaid: order.bill_paid,
		biller_name: order.biller_name,
		taxDetails: order.tax_details,
	};
};
