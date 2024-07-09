import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import axios from "axios";

export const getProvinsi = createAsyncThunk("address/getProvinsi", async () => {
  const { data } = await axios.get(
    `https://kanglerian.github.io/api-wilayah-indonesia/api/provinces.json`
  );
  return data;
});

export const getKabupaten = createAsyncThunk(
  "address/getKabupaten",
  async (provinsiId) => {
    const { data } = await axios.get(
      `https://kanglerian.github.io/api-wilayah-indonesia/api/regencies/${provinsiId}.json`
    );
    return data;
  }
);

export const getKecamatan = createAsyncThunk(
  "address/getKecamatan",
  async (kabupatenId) => {
    const { data } = await axios.get(
      `https://kanglerian.github.io/api-wilayah-indonesia/api/districts/${kabupatenId}.json`
    );
    return data;
  }
);

export const getKelurahan = createAsyncThunk(
  "address/getKelurahan",
  async (kecamatanId) => {
    const { data } = await axios.get(
      `https://kanglerian.github.io/api-wilayah-indonesia/api/villages/${kecamatanId}.json`
    );
    return data;
  }
);

export const getAddress = createAsyncThunk("address/getAddress", async () => {
  const userToken = localStorage.getItem("token");
  const response = await axios.get(
    `https://makanminum-server.vercel.app/api/delivery-address`,
    {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }
  );
  return response.data;
});

export const addAddress = createAsyncThunk(
  "address/addAddress",
  async (address) => {
    const userToken = localStorage.getItem("token");
    const response = await axios.post(
      `https://makanminum-server.vercel.app/api/delivery-address`,
      {
        name: address.name,
        provinsi: address.provinsi,
        kabupaten: address.kabupaten,
        kecamatan: address.kecamatan,
        kelurahan: address.kelurahan,
        detail: address.detail,
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

export const updateAddress = createAsyncThunk(
  "address/addAddress",
  async (address) => {
    const userToken = localStorage.getItem("token");
    const response = await axios.put(
      `https://makanminum-server.vercel.app/api/delivery-address/${address._id}`,
      {
        name: address.name,
        provinsi: address.provinsi,
        kabupaten: address.kabupaten,
        kecamatan: address.kecamatan,
        kelurahan: address.kelurahan,
        detail: address.detail,
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

const addressEntity = createEntityAdapter({
  selectId: (address) => address._id,
});

const addressSlice = createSlice({
  name: "address",
  initialState: {
    ...addressEntity.getInitialState(),
    indonesia: { provinsi: "", kabupaten: "", kecamatan: "", kelurahan: "" },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProvinsi.fulfilled, (state, action) => {
        state.indonesia.provinsi = action.payload;
      })
      .addCase(getKabupaten.fulfilled, (state, action) => {
        state.indonesia.kabupaten = action.payload;
      })
      .addCase(getKecamatan.fulfilled, (state, action) => {
        state.indonesia.kecamatan = action.payload;
      })
      .addCase(getKelurahan.fulfilled, (state, action) => {
        state.indonesia.kelurahan = action.payload;
      })
      .addCase(getAddress.fulfilled, (state, action) => {
        addressEntity.setAll(state, action.payload.data);
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        addressEntity.updateOne(state, action.payload);
      });
  },
});

export const addressSelectors = addressEntity.getSelectors(
  (state) => state.address
);

export default addressSlice.reducer;
