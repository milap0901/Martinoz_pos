import { createSlice } from "@reduxjs/toolkit";

const menuItemsSlice = createSlice({
	name: "menuItems",
	initialState: { id: "", items: [] },
	reducers: {
		setMenuItems: (state, action) => {
			const { items, id } = action.payload;
			state.id = id;
			state.items = items;
		},
	},
});

export const { setMenuItems } = menuItemsSlice.actions;
export default menuItemsSlice.reducer;
