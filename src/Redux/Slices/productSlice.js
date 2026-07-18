import { createSlice } from "@reduxjs/toolkit";

const productReducer = createSlice({
  name: "product",
  initialState: {
    products: [],
  },
  reducers: {
    getProducts: (state, action) => {
      state.products = action.payload;
    },
    deleteProducts: (state, action) => {
      state.products = state.products.filter(
        (product) => product._id !== action.payload,
      );
    },
    postProducts: (state, action) => {
      state.products.unshift(action.payload);
    },
    updateProduct: (state, action) => {
      state.products = state.products.map((product) => {
        if (product._id === action.payload._id) {
          return {
            ...action.payload,
            image: action.payload.image || product.image,
          };
        }
        return product;
      });
    },
  },
});

export const { getProducts, deleteProducts, postProducts, updateProduct } =
  productReducer.actions;
export default productReducer.reducer;
