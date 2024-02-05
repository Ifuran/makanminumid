import { configureStore } from "@reduxjs/toolkit";
import productReducer from "../features/productSlice";
import categoryReducer from "../features/categorySlice";
import tagReducer from "../features/tagSlice";
import userReducer from "../features/userSlice";
import addressReducer from "../features/addressSlice";
import orderReducer from "../features/orderSlice";
import invoiceReducer from "../features/invoiceSlice";

export const store = configureStore({
  reducer: {
    product: productReducer,
    category: categoryReducer,
    tag: tagReducer,
    user: userReducer,
    address: addressReducer,
    order: orderReducer,
    invoice: invoiceReducer,
  },
});
