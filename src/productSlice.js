import { createSlice } from "@reduxjs/toolkit";
import { PRODUCT_TYPES } from "./components/constants/constants";

const productSlice = createSlice({
  name: "product",
  initialState: {
    productType: PRODUCT_TYPES.KOLACI,
  },
  reducers: {
    updateProductType: (state, action) => {
      state.productType = action.payload;
    },
  },
});

export const { updateProductType } = productSlice.actions;
export default productSlice.reducer;
