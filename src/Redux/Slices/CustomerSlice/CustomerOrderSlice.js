import { createSlice } from "@reduxjs/toolkit";


const CustomerOrderSlice = createSlice({
    name: 'orderlist',
    initialState: {
      orderlist: [],
    },
    reducers: {
      addOrder: (state, action) => {
        state.orderlist.push(action.payload);
      },
      getCustomerOrder: (state, action) => {
        state.orderlist = action.payload;
      },
      deleteCustomerOrder: (state, action) => {
        state.orderlist = state.orderlist.filter(
          (order) => order._id !== action.payload
        );
      },
    
    }
  });
  
  export const { addOrder, getCustomerOrder, deleteCustomerOrder } = CustomerOrderSlice.actions;
  export default CustomerOrderSlice.reducer;