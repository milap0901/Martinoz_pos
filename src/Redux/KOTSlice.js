import { createSlice } from "@reduxjs/toolkit";

const KOTSlice = createSlice({
      name: "KOTs",
      initialState: [],
      reducers: {
            setKOT: (state, action) => {
                  const { data } = action.payload;
                  return [...data];
            },
            modifyKOT : (state,action) =>{
                  const {id} = action.payload
                  return [...state.filter(KOT=> id!==KOT.id)]

            }
      },
});

export const { setKOT,modifyKOT } = KOTSlice.actions;
export default KOTSlice.reducer;
