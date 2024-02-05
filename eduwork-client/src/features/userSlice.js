import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import axios from "axios";

export const registerUser = createAsyncThunk("user/register", async (data) => {
  const response = await axios.post("http://localhost:3000/auth/register", {
    full_name: data.fullName,
    email: data.email,
    password: data.password,
  });
  return response.data;
});

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (userCredentials) => {
    const { data } = await axios.post(
      "http://localhost:3000/auth/login",
      userCredentials
    );
    if (data.token) {
      localStorage.setItem("token", data.token);
    }
    return data;
  }
);

export const getUser = createAsyncThunk("user/getUser", async () => {
  const userToken = localStorage.getItem("token");
  const response = await axios.get("http://localhost:3000/auth/profile", {
    headers: {
      authorization: `Bearer ${userToken}`,
    },
  });
  return response.data;
});

export const logoutUser = createAsyncThunk(
  "user/logoutUser",
  async (userCredentials) => {
    const userToken = localStorage.getItem("token");
    const response = await axios.post(
      "http://localhost:3000/auth/logout",
      {
        email: userCredentials.email,
        password: userCredentials.email,
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );
    localStorage.removeItem("token");
    return response.data;
  }
);

const userEntity = createEntityAdapter({
  selectId: (user) => user._id,
});

const userSlice = createSlice({
  name: "user",
  initialState: userEntity.getInitialState(),
  extraReducers: (builder) => {
    builder.addCase(loginUser.fulfilled, (state, action) => {
      if (!action.payload.error) {
        userEntity.upsertOne(state, action.payload.user);
      }
    });
    builder.addCase(getUser.fulfilled, (state, action) => {
      if (!action.payload.error) {
        userEntity.upsertOne(state, action.payload);
      }
    });
    builder.addCase(logoutUser.fulfilled, (state, action) => {
      userEntity.removeAll(state, action.payload);
    });
  },
});

export const userSelectors = userEntity.getSelectors((state) => state.user);

export default userSlice.reducer;
