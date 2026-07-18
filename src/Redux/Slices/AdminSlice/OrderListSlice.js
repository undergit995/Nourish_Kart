import { createSlice } from "@reduxjs/toolkit";


const OrderListSlice = createSlice({
    name: 'orderlist',
    initialState: {
      orderlist: [],
    },
    reducers: {
      addOrder: (state, action) => {
        state.orderlist.push(action.payload);
      },
      getOrder: (state, action) => {
        state.orderlist = action.payload;
      }
    }
  });
  
  export const { addOrder, getOrder } = OrderListSlice.actions;
  export default OrderListSlice.reducer;