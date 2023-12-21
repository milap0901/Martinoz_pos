import { createSlice } from "@reduxjs/toolkit";

const initialState = { liveViewOrderType: "all", liveViewOrderStatus: "", isCartActionDisable: false, holdOrderCount: 0, restaurantPriceId: null, activeOrderBtns: ["save", "kot", "hold"] };

const UIActiveSlice = createSlice({
	name: "UIActive",
	initialState: initialState,
	reducers: {
		modifyUIActive: (state, action) => ({ ...state, ...action.payload }),

		setActive: (state, action) => {
			const { key, name } = action.payload;
			state[key] = name;
		},
	},
});

export const { setActive, modifyUIActive } = UIActiveSlice.actions;
export default UIActiveSlice.reducer;
