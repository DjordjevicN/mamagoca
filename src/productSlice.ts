import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PRODUCT_TYPES } from "./components/constants/constants";

interface ProductState {
  productType: string;
}

const initialState: ProductState = {
  productType: PRODUCT_TYPES.KOLACI,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    updateProductType: (state, action: PayloadAction<string>) => {
      state.productType = action.payload;
    },
  },
});

export const { updateProductType } = productSlice.actions;
export default productSlice.reducer;
