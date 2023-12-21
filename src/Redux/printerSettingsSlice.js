import { createSlice } from "@reduxjs/toolkit";

const printerSettingsSlice = createSlice({
      name: "printerSettings",
      initialState: [],
      reducers: {
            setPrinters: (state, action) => {
                  const { FullPrintersData} = action.payload;
                  return [...FullPrintersData];
            },
      },
});

export const { setPrinters } = printerSettingsSlice.actions;
export default printerSettingsSlice.reducer;
