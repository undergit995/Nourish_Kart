import { createSlice } from "@reduxjs/toolkit";


const OfferSlice = createSlice({
    name: 'Offers',
    initialState: {
      offers: [],
    },
    reducers: {
      addOffer: (state, action) => {
        state.offers.push(action.payload);
      },
      getOffer: (state, action) => {
        state.offers = action.payload;
      },
      deleteOffer: (state, action) => {
        state.offers = state.offers.filter((item) => item._id !== action.payload);
      },
      updateOffer: (state, action) => {
        state.offers = state.offers.map((item) => {
          if (item._id === action.payload._id) {
            return action.payload;
          }
          return item;
        });
      },
    },
  });
  
  export const { addOffer, getOffer, deleteOffer, updateOffer } = OfferSlice.actions;
  export default OfferSlice.reducer;