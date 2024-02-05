import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import axios from "axios";

export const getProduct = createAsyncThunk(
  "product/getProduct",
  async (productId) => {
    const response = await axios.get(
      `http://localhost:3000/api/products/${productId}`
    );
    return response.data;
  }
);

// export const getProducts = createAsyncThunk(
//   "product/getProducts",
//   async ({ skip, selectedCategory, selectedTags, searchTerm }) => {
//     const tagsQueryString = selectedTags
//       .map((tag) => `tags[]=${tag}`)
//       .join("&");
//     const response = await axios.get(
//       `http://localhost:3000/api/products?skip=${skip}&category=${selectedCategory}&${tagsQueryString}&q=${searchTerm}`
//     );
//     return response.data;
//   }
// );

export const getProducts = createAsyncThunk(
  "product/getProducts",
  async ({ skip }, { getState }) => {
    const { filters } = getState().product; // Mengambil filter dari state
    const { selectedCategory, selectedTags, searchTerm } = filters;

    const tagsQueryString = selectedTags
      .map((tag) => `tags[]=${tag}`)
      .join("&");

    const response = await axios.get(
      `http://localhost:3000/api/products?skip=${skip}&category=${selectedCategory}&${tagsQueryString}&q=${searchTerm}`
    );
    return response.data;
  }
);

export const addProduct = createAsyncThunk(
  "product/addProduct",
  async (dataProduct) => {
    const userToken = localStorage.getItem("token");
    const response = await axios.post(
      `http://localhost:3000/api/products`,
      {
        name: dataProduct.name,
        description: dataProduct.description,
        price: dataProduct.price,
        image_url: dataProduct.image,
        category: dataProduct.category,
        tags: dataProduct.tag,
      },
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log(response.data);
    return response.data;
  }
);

export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async (dataProduct) => {
    const userToken = localStorage.getItem("token");
    const tagNames = dataProduct.tags.map((tag) => tag.name);
    const response = await axios.put(
      `http://localhost:3000/api/products/${dataProduct._id}`,
      {
        name: dataProduct.name,
        description: dataProduct.description,
        price: dataProduct.price,
        image_url: dataProduct.image,
        category: dataProduct.category,
        tags: tagNames,
      },
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log(response.data);
    return response.data;
  }
);

export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (productId) => {
    const userToken = localStorage.getItem("token");
    const response = await axios.delete(
      `http://localhost:3000/api/products/${productId}`,
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );
    return response.data;
  }
);

const productEntity = createEntityAdapter({
  selectId: (product) => product._id,
});

const productSlice = createSlice({
  name: "product",
  initialState: {
    ...productEntity.getInitialState(),
    productDetail: {},
    page: {
      totalPage: 0,
      totalItem: 0,
    },
    filters: {
      selectedCategory: null,
      selectedTags: [],
      searchTerm: "",
    },
    cart: [],
  },
  reducers: {
    updateFilters: (state, action) => {
      state.filters = action.payload;
    },
    addToCart: (state, action) => {
      let prevItems = state.cart.filter(
        (product) => product._id !== action.payload._id
      );
      let newItems = state.cart.filter(
        (product) => product._id === action.payload._id
      );
      let newQty = newItems.length ? newItems[0]?.qty + 1 : 1;
      newItems.length
        ? (newItems[0] = { ...action.payload, qty: newQty })
        : (newItems = [{ ...action.payload, qty: newQty }]);
      prevItems.push(newItems[0]);
      state.cart = prevItems;
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
    removeItem: (state, action) => {
      state.cart = state.cart.filter(
        (product) => product._id !== action.payload
      );
      localStorage.removeItem("cart");
    },
    incrementItem: (state, action) => {
      state.cart
        ?.filter((product) => product._id === action.payload)
        .map((product) => {
          const currentQty = product.qty;
          product.qty = currentQty + 1;
          return product;
        });
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
    decrementItem: (state, action) => {
      state.cart
        ?.filter((product) => product._id === action.payload)
        .map((product) => {
          const currentQty = product.qty;
          currentQty === 1 ? (product.qty = 1) : (product.qty = currentQty - 1);
          return product;
        });
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
    updateCart: (state) => {
      if (!state.cart.length && localStorage.getItem("cart")) {
        try {
          state.cart = JSON.parse(localStorage.getItem("cart"));
        } catch (error) {
          if (error) localStorage.removeItem("cart");
        }
      }
      if (state.cart.length && !localStorage.getItem("cart")) {
        try {
          state.cart = [];
        } catch (error) {
          if (error) localStorage.removeItem("cart");
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProduct.fulfilled, (state, action) => {
        state.productDetail = action.payload;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        productEntity.setAll(state, action.payload.data);
        const perPage = 6;
        state.page.totalPage = Math.ceil(action.payload.count / perPage);
        state.page.totalItem = action.payload.count;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        productEntity.addOne(state, action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        productEntity.updateOne(state, action.payload);
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        productEntity.removeOne(state, action.payload.data);
      });
  },
});

export const productSelectors = productEntity.getSelectors(
  (state) => state.product
);

export const {
  updateFilters,
  addToCart,
  decrementItem,
  incrementItem,
  removeItem,
  updateCart,
} = productSlice.actions;

export default productSlice.reducer;
