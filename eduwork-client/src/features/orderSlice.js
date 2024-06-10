import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getOrder = createAsyncThunk("order/getOrder", async () => {
  const userToken = localStorage.getItem("token");
  const response = await axios.get(`http://localhost:3000/api/order`, {
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  });
  return response.data;
});

export const addOrder = createAsyncThunk(
  "order/addOrder",
  async ({ delivery_fee, delivery_address, cart }) => {
    const userToken = localStorage.getItem("token");
    localStorage.removeItem("cart");

    const response = await axios.post(
      `http://localhost:3000/api/order`,
      {
        delivery_fee,
        delivery_address,
        cart,
      },
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    order: [],
  },
  extraReducers: {
    [addOrder.fulfilled]: (state, action) => {
      state.order = action.payload.order;
    },
    [getOrder.fulfilled]: (state, action) => {
      state.order = action.payload.orders;
    },
  },
});

export default orderSlice.reducer;
