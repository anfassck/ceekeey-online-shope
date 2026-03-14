import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import UploadScreen from './UploadScreen';
import HomeScreen from './HomeScreen';
import Navbar from './Navbar';
import CartScreen from './CartPage ';
import UploaderCategory from './UploaderCategory';
import UploadeSlider from './UploadeSlider';
import ProductsSection from './ProductsSection';
import ProductDetails from './ProductDetails';
import CategoryDetails from './CategoryDetails';
import AddressPage from "./addressPage.jsx";
import PaymentPage from './PaymentPage';
import SuccessPage from './SuccessPage';
import OrdersPage from './OrderPage';
import DashboardLayout from './DashboardLayout';
import MyProfile from './MyProfile';
import AuthPage from './AuthPage';

// Admin Pages
import AdminDashboard from './admin/AdminDashboard';
import AdminOrders from './admin/AdminOrders';
import AdminProducts from './admin/AdminProducts';
import AdminCustomers from './admin/AdminCustomers';
import AdminSales from './admin/AdminSales';
import AdminCategories from './admin/AdminCategories';
import AdminSliders from './admin/AdminSliders';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* ---- Public Routes ---- */}
        <Route path="/" element={<HomeScreen />} />
        <Route path="nav" element={<Navbar />} />
        <Route path="/cart" element={<CartScreen />} />
        <Route path="/prodect" element={<ProductsSection />} />
        <Route path="/product/details/:id" element={<ProductDetails />} />
        <Route path="/category/details/:id" element={<CategoryDetails />} />
        <Route path="/address" element={<AddressPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/profile" element={<MyProfile />} />
        <Route path="/auth" element={<AuthPage />} />

        {/* ---- Admin Dashboard ---- */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          {/* Overview */}
          <Route index element={<AdminDashboard />} />
          {/* Orders */}
          <Route path="orders" element={<AdminOrders />} />
          {/* Products */}
          <Route path="products" element={<AdminProducts />} />
          {/* Customers */}
          <Route path="customers" element={<AdminCustomers />} />
          {/* Sales Analytics */}
          <Route path="sales" element={<AdminSales />} />
          {/* Categories Manager */}
          <Route path="categories" element={<AdminCategories />} />
          {/* Sliders Manager */}
          <Route path="sliders" element={<AdminSliders />} />
          {/* Original upload pages */}
          <Route path="uploads" element={<UploadScreen />} />
          <Route path="uploade" element={<UploadeSlider />} />
          <Route path="uploader" element={<UploaderCategory />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);