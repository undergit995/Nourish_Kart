import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    users: [],
  },
  reducers: {
    setData: (state, action) => {
      state.users = action.payload;
    },
    deleteUser: (state, action) => {
      state.users = state.users.filter((item) => item._id !== action.payload);
    },
  },
});

export const { setData, deleteUser } = userSlice.actions;
export default userSlice.reducer;