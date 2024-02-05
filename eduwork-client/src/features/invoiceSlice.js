import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getInvoice = createAsyncThunk(
  "invoice/getInvoice",
  async (orderId) => {
    const userToken = localStorage.getItem("token");
    const response = await axios.get(
      `http://localhost:3000/api/invoice/${orderId}`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    return response.data;
  }
);

const invoiceSlice = createSlice({
  name: "invoice",
  initialState: { invoice: {} },
  extraReducers: {
    [getInvoice.fulfilled]: (state, action) => {
      state.invoice = action.payload;
    },
  },
});

export default invoiceSlice.reducer;
