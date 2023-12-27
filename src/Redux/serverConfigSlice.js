import { createSlice } from "@reduxjs/toolkit";

const serverConfigSlice = createSlice({
  name: "serverConfig",
  initialState: {
    systemType: "",
    IPAddress: "",
    refetchInterval: 400000,
    biller: null,
    subscription: {
      is_free_trial: 0,
      is_licence: 0,
    },
  },
  reducers: {
    setSystem: (state, action) => {
      const { name, value } = action.payload;
      state[name] = value;
    },
  },
});

export const { setSystem } = serverConfigSlice.actions;
export default serverConfigSlice.reducer;
