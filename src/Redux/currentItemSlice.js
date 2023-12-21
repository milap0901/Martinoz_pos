import { createSlice } from "@reduxjs/toolkit";

const initialCurrentItems = {
	itemStatus:"default",
	currentOrderItemId: "",
	itemQty: 0,
	itemId: "",
	categoryId: "",
	itemName: "",
	variation_id: "",
	variantName: "",
	variant_display_name: "",
	basePrice: 0,
	toppings: [],
	itemTotal: 0,
	multiItemTotal: 0,
	parent_tax: 0,
	itemTax: [],
	itemNotes: "",
	kotId:null,
	item_discount:0,
	discount_detail:[]
}

const currentItemSlice = createSlice({
	name: "currentItem",
	initialState: initialCurrentItems,

	reducers: {
		addCurrentItem: (state, action) => {
			state.currentOrderItemId = action.payload.orderItemId;
			state.variant_display_name = action.payload.defaultVariantDisplayName;
			state.itemId = action.payload.id;
			state.itemName = action.payload.name;
			state.itemQty = 1;
			state.variation_id = action.payload.defaultVariantId;
			state.variantName = action.payload.defaultVariantName;
			state.basePrice = action.payload.defaultVariantPrice;
			state.toppings = [];
			state.itemTotal = action.payload.defaultVariantPrice;
			state.multiItemTotal = action.payload.defaultVariantPrice;
			state.categoryId = action.payload.category_id;
			state.parent_tax = action.payload.parent_tax
		},

		selectVariant: (state, action) => {
			state.variation_id = action.payload.variation_id;
			state.variantName = action.payload.name;
			state.variant_display_name = action.payload.display_name;
			state.basePrice = +action.payload.price;
			state.itemTotal = +action.payload.price;
			state.toppings = [];
			state.multiItemTotal = state.itemTotal;
		},

		addTopping: (state, action) => {
			let { id, name, price } = action.payload;
			let existingTopping = state.toppings.find((topping) => id === topping.id);

			if (existingTopping) {
				existingTopping.quantity += 1;
			} else {
				const newTopping = { id, name, price, quantity: 1 };
				state.toppings.push(newTopping);
			}

			state.itemTotal += +price;
			state.multiItemTotal = state.itemTotal;
		},

		clearToppings: (state, action) => {
			state.toppings = [];
			state.itemTotal = state.basePrice;
		},

		removeTopping: (state, action) => {
			const { id, price } = action.payload;
			let topping = state.toppings.find((topping) => id === topping.id);

			if (topping.quantity === 1) {
				state.toppings = state.toppings.filter((topping) => !(topping.id === id && topping.quantity === 1));
			} else {
				topping.quantity = topping.quantity - 1;
			}

			state.itemTotal = state.itemTotal - +price;
			state.multiItemTotal = state.multiItemTotal - +price;
		},

		clearCurrentItem: (state, action) => {
			return initialCurrentItems
		},
	},
});

export default currentItemSlice.reducer;
export const { clearToppings, addCurrentItem, selectVariant, addTopping, removeTopping, clearCurrentItem } = currentItemSlice.actions;
