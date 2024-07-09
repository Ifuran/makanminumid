import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import axios from "axios";

export const getCategories = createAsyncThunk(
  "category/getCategories",
  async () => {
    const response = await axios.get(
      "https://makanminum-server.vercel.app/api/category"
    );
    return response.data;
  }
);

const categoryEntity = createEntityAdapter({
  selectId: (category) => category._id,
});

const categorySlice = createSlice({
  name: "category",
  initialState: categoryEntity.getInitialState(),
  extraReducers: {
    [getCategories.fulfilled]: (state, action) => {
      categoryEntity.setAll(state, action.payload);
    },
  },
});

export const categorySelectors = categoryEntity.getSelectors(
  (state) => state.category
);

export default categorySlice.reducer;
