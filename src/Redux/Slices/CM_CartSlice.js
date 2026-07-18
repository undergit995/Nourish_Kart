import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosConfig";

export const getItems = createAsyncThunk(
  "cart/getItems",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/cart/getCart`);
      return response.data.cart;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (productData, { rejectWithValue }) => {
    try {
      const response = await api.post(`/cart/setCart`, productData);
      return response.data.cartItem;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({ cartId, quantity }, { rejectWithValue }) => {
    try {
      let res = await api.put(`/cart/setQuantity/${cartId}`, { quantity });
      return { _id: cartId, quantity };
    } catch (error) {
      console.log(res.error.message);
      return rejectWithValue(error.response.data);
    }
  },
);

export const removeCartItem = createAsyncThunk(
  "cart/removeCartItem",
  async (cartId, { rejectWithValue }) => {
    try {
      await api.delete(`/cart/deleteItem/${cartId}`);
      return cartId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    cartValue: 0,
    totals: null,
    status: "idle",
    error: null,
  },
  reducers: {
    addValue: (state, action) => {
      state.cartValue = action.payload.reduce((total, current) => {
        return total + current.quantity;
      }, 0);
    },
    clearCart: (state) => {
      state.items = [];
      state.totals = null;
      state.cartValue = 0;
    },
    allApplyCoupon: (state, action) => {
      state.totals = action.payload;
    },
    removeCoupon: (state) => {
      state.totals = null;
      state.items = state.items.map((item) => {
        const { coupon, ...rest } = item;
        return rest;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getItems.pending, (state) => {
        state.status = "loading";
      })

      .addCase(getItems.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
        state.totals = null;
        state.cartValue = action.payload.reduce(
          (sum, item) => sum + item.quantity,
          0,
        );
      })

      .addCase(getItems.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(addToCart.fulfilled, (state, action) => {
        const cartItem = action.payload;
        const existingItem = state.items.find(
          (item) => item._id === cartItem._id,
        );

        if (existingItem) {
          state.cartValue = state.cartValue - existingItem.quantity + cartItem.quantity;
          existingItem.quantity = cartItem.quantity;
        } else {
          state.items.push(cartItem);
          state.cartValue += cartItem.quantity;
        }
      })

      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        const item = state.items.find(
          (item) => item._id === action.payload._id,
        );

        if (item) {
          state.cartValue =
            state.cartValue - item.quantity + action.payload.quantity;
          item.quantity = action.payload.quantity;
        }
      })
      .addCase(updateCartQuantity.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(removeCartItem.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item._id === action.payload,
        );

        if (index !== -1) {
          state.cartValue -= state.items[index].quantity;
          state.items.splice(index, 1);
        }
      });
  },
});

export const { clearCart, addValue, allApplyCoupon, removeCoupon } =
  cartSlice.actions;
export default cartSlice.reducer;
