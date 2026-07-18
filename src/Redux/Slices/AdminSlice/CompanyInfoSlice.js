import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api/axiosConfig";


export const fetchCompanyInfo = createAsyncThunk(
  "companyInfo/fetchInfo",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/company/get");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const companyInfoSlice = createSlice({
  name: "companyInfo",
  initialState: {
    info: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanyInfo.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCompanyInfo.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.info = action.payload;
      })
      .addCase(fetchCompanyInfo.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default companyInfoSlice.reducer;