import { createSlice } from "@reduxjs/toolkit";

const bigMenuSlice = createSlice({
	name: "bigMenu",
	initialState: { categories: [], areas: [],defaultSettings:{} },
	reducers: {
		setBigMenu: (state, action) => {
			const { data } = action.payload;
			state.categories = data.categories;
			state.areas = data.areas;
			state.defaultSettings = data.defaultSettings
		},
	},
});

export const { setBigMenu } = bigMenuSlice.actions;
export default bigMenuSlice.reducer;
