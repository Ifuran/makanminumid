import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import axios from "axios";

export const getTags = createAsyncThunk("tag/getTags", async () => {
  const response = await axios.get("http://localhost:3000/api/tags");
  return response.data;
});

const tagEntity = createEntityAdapter({
  selectId: (tag) => tag._id,
});

const tagSlice = createSlice({
  name: "tag",
  initialState: tagEntity.getInitialState(),
  extraReducers: {
    [getTags.fulfilled]: (state, action) => {
      tagEntity.setAll(state, action.payload);
    },
  },
});

export const tagSelectors = tagEntity.getSelectors((state) => state.tag);
export default tagSlice.reducer;
