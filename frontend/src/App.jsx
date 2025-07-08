import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import BuyerLogin from "./pages/buyer/BuyerLogin"
import BuyerRegister from "./pages/buyer/BuyerRegister";
import ForgotPassword from "./pages/ForgetPasswords";
import ResetPassword from "./pages/ResetPassword";
import ChooseRole from "./pages/RoleSelection";
import SellerRegister from "./pages/seller/SellerRegister";
import SellerLogin from "./pages/seller/SellerLogin";
import SellerDashboard from "./pages/seller/Dashboard";
import InventoryPage from "./pages/seller/SellerInventory";
import SellerSettings from "./pages/seller/SellerSettings";
import SellerProductView from "./pages/seller/SellerProductView";
import SellerUpdatePage from "./pages/seller/SellerUpdatePage";
import SellerProductAdd from "./pages/seller/SellerProductPage";
import SellerViewedListings from "./pages/seller/SellerViewedListings";
import Home from "./pages/Home";
import Unauthorized from "./pages/Unauthorized";
import BuyerDashboard from "./pages/buyer/BuyerDashboard";
import BuyerProductView from "./pages/buyer/BuyerProductView";
import ProductComparison from "./pages/buyer/ProductComparison";
import BuyerSearch from "./pages/buyer/BuyerSearch";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminSellerPage from "./pages/admin/AdminSellerPage";
import AdminSellerDetail from "./pages/admin/AdminSellerDetail"


function App() {
  return (
    
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/choose-role" element={<ChooseRole />} />
        <Route path="/buyer/login" element={<BuyerLogin />} />
        <Route path="/buyer/register" element={<BuyerRegister />}/>
        <Route path="/buyer/dashboard" element={<BuyerDashboard />}/>
        <Route path="/buyer/listing/:listingId" element={<BuyerProductView />} />
        <Route path="/buyer/compare" element={<ProductComparison/>}/>
        <Route path="/buyer/search" element={<BuyerSearch />} />
        



        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route path="/seller/register" element={<SellerRegister />} />
        <Route path="/seller/login" element={<SellerLogin />} />
        <Route path="/seller/dashboard" element={<SellerDashboard />} />
        <Route path="/seller/inventory" element={<InventoryPage />} />
        <Route path="/seller-settings" element={<SellerSettings />} />
        {/* <Route path="/sellerviewpage" element={<SellerProductView />} /> */}
        <Route path="/seller/view-page/:listingId" element={<SellerProductView />} />
        <Route path="/seller/update-page/:listingId" element={<SellerUpdatePage />} />
        <Route path="/seller/add-product" element={<SellerProductAdd />} />
        <Route path="/seller/viewed-listings" element={<SellerViewedListings />} />

        <Route path="/unauthorized" element={<Unauthorized />} />


        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/sellers" element={<AdminSellerPage />} />
        <Route path="/admin/sellers/:id" element={<AdminSellerDetail />} />




      </Routes>

    </Router>
  )
}

export default App
