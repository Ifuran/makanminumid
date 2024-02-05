import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import Product from "./pages/Product";
import Invoice from "./pages/Invoice";
import Account from "./pages/Account";
import ProductDetail from "./pages/ProductDetail";
import ManageProducts from "./pages/ManageProducts";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Product />} />
        <Route path="/product/:productId" element={<ProductDetail />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/invoice/:invoiceId" element={<Invoice />} />
        <Route path="/account" element={<Account />} />
        <Route path="/manage-products" element={<ManageProducts />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
