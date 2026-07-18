import { createSlice } from "@reduxjs/toolkit";


const ReviewSlice = createSlice({
    name: 'Review',
    initialState: {
      reviews: [],
    },
    reducers: {
      addReview: (state, action) => {
        state.reviews.push(action.payload);
      },
      getReviews: (state, action) => {
        state.reviews = action.payload;
      },
    },
  });
  
  export const { addReview, getReviews } = ReviewSlice.actions;
  export default ReviewSlice.reducer;