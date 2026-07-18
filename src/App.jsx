import React, { Suspense, lazy } from "react";
import { Box, CircularProgress, Typography } from "@mui/material"
import { BrowserRouter,Routes,Route } from "react-router-dom";
import ProtectedRoutes from "./Routes/ProtectedRoutes";
import ErrorBoundary from "./ErrorBoundary";

// Common Pages
const MainAuthCard = lazy(() => import("./Pages/Common/MainAuthCard"));
const Login = lazy(() => import("./Pages/Common/Login"));
const Register = lazy(() => import("./Pages/Common/Register"));
const VerifyOtp = lazy(() => import("./Pages/Common/VerifyOtp"));
const ForgotPassword = lazy(() => import("./Pages/Common/ForgetPassword"));
const ResetPassword = lazy(() => import("./Pages/Common/ResetPassword"));
const ForgotVerifyOtp = lazy(() => import("./Pages/Common/ForgetVerifyOtp"));
const LandingPage = lazy(() => import("./Pages/Common/LandingPage"));
const LandingPageLayout = lazy(() => import("./Pages/Common/LandingPageLayout"));
const EmailVerify = lazy(() => import("./Pages/Common/EmailVerify"));
const About = lazy(() => import("./Pages/Common/About"));

// Admin Pages
const DashboardLayout = lazy(() => import("./Pages/Admin/Layout/Dashboard"));
const UserDetails = lazy(() => import("./Pages/Admin/UsersOperations/UserDetails"));
const UpdateProducts = lazy(() => import("./Pages/Admin/Products/UpdateProducts"));
const AdminProducts = lazy(() => import("./Pages/Admin/Products/AdminProducts"));
const Overview = lazy(() => import("./Pages/Admin/Home/AdminHome"));
const OrderRecordsDashboard = lazy(() => import("./Pages/Admin/Orders/OrderDetails"));
const Offers = lazy(() => import("./Pages/Admin/Offers/Offers"));
const AdminProductPage = lazy(() => import("./Pages/Admin/Products/AdminProductPage"));
const OrderRecordsDashboardById = lazy(() => import("./Pages/Admin/Orders/OrderDetailsById"));
const CompanyInfo = lazy(() => import("./Pages/Admin/MyCompany/CompanyInfo"));
const UpdateInfo = lazy(() => import("./Pages/Admin/MyCompany/UpdateInfo"));
const AllCoupon = lazy(() => import("./Pages/Admin/CouponAdmin/CouponAdmin"));
const CouponForm = lazy(() => import("./Pages/Admin/CouponAdmin/CouponForm"));
const AdminHome = lazy(() => import("./Pages/Admin/Home/AdminHome"));

// Customer Pages
const Home = lazy(() => import("./Pages/Customer/Layout/Home"));
const CustomerDashboard = lazy(() => import("./Pages/Customer/Layout/CustomerDashboard"));
const CustomerProducts = lazy(() => import("./Pages/Customer/CustomerProducts/CustomerProducts"));
const ProductPage = lazy(() => import("./Pages/Customer/CustomerProducts/ProductPage"));
const CustomerCart = lazy(() => import("./Pages/Customer/Cart/CustomerCart"));
const OrderList = lazy(() => import("./Pages/Customer/CustomerOrder/OrderList"));
const CustomerProfile = lazy(() => import("./Pages/Customer/Profile/CustomerProfiles"));
const CustomerEditProfile = lazy(() => import("./Pages/Customer/Profile/CustomerEditProfile"));
const CustomerEditAddress = lazy(() => import("./Pages/Customer/Profile/CustomerEditAddress"));
const ReviewOfProducts = lazy(() => import("./Pages/Customer/CustomerOrder/ReviewOfProducts"));
const Coupon = lazy(() => import("./Pages/Customer/Cart/Coupon"));

const LoadingFallback = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <CircularProgress />
    <Typography ml={2}>Loading...</Typography>
  </Box>
);


function App() {

  return (
    <Box>
        <BrowserRouter>
          <ErrorBoundary fallback={<Typography variant="h5" textAlign="center" mt={10}>Oops! Something went wrong loading the page.</Typography>}>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path ="/" element={<LandingPageLayout/>}>
                  <Route index element={<LandingPage/>}/>
                  <Route path ="/register" element={<Register/>}/>
                  <Route path ="/verify-email" element={<EmailVerify/>}/>
                  <Route path ="/verify-otp" element={<VerifyOtp/>}/>
                  <Route path ="/login" element={<Login/>}/>
                  <Route path ="/about" element={<About/>}/>
                  <Route path ="/forget" element={<ForgotPassword/>}/>
                  <Route path ="/forget/forgetverifyOtp" element={<ForgotVerifyOtp/>}/>
                  <Route path ="/forget/forgetverifyOtp/resetpassword" element={<ResetPassword/>}/>
                  <Route path ="/auth" element={<MainAuthCard/>}/>
                </Route>

                <Route path ="/admin" element={<ProtectedRoutes role="admin"><DashboardLayout/></ProtectedRoutes>}>
                  <Route index element={<Overview/>}/>
                  <Route path ="/admin/overview" element={<AdminHome/>}/>
                  <Route path ="/admin/customers" element={<UserDetails/>}/>
                  <Route path="/admin/orders" element ={<OrderRecordsDashboard/>}/>
                  <Route path="/admin/orders/:id" element ={<OrderRecordsDashboardById/>}/>
                  <Route path="/admin/products" element={<AdminProducts/>}/>
                  <Route path="/admin/productlist/:id" element={<AdminProductPage/>}/>
                  <Route path="/admin/products/updateProduct/:id" element={<UpdateProducts/>}/>
                  <Route path="/admin/info" element={<CompanyInfo/>}/>
                  <Route path="/admin/infoupdate/:id" element={<UpdateInfo/>}/>
                  <Route path="/admin/coupons" element={<AllCoupon/>}/>
                  <Route path="/admin/handlecoupon/:id" element={<CouponForm/>}/>
                  <Route path="/admin/banners" element={<Offers/>}/>
                </Route>

                <Route path ="/customer" element={<ProtectedRoutes role="customer"><CustomerDashboard/></ProtectedRoutes>}>
                  <Route index element={<Home/>}/>
                  <Route path ="/customer/home" element={<Home/>}/>
                  <Route path="/customer/users" element={<UserDetails/>}/>
                  <Route path="/customer/profile" element={<CustomerProfile/>}/>
                  <Route path ="/customer/about" element={<About/>}/>
                  <Route path="/customer/products" element={<CustomerProducts/>}/>
                  <Route path="/customer/productpage/:id" element={<ProductPage/>}/>
                  <Route path="/customer/cart" element={<CustomerCart/>}/>
                  <Route path="/customer/coupon" element={<Coupon/>}/>
                  <Route path ="/customer/editprofile" element={<CustomerEditProfile/>}/>
                  <Route path ="/customer/editaddress" element={<CustomerEditAddress/>}/>
                  <Route path ="/customer/editaddress/:id" element={<CustomerEditAddress/>}/>
                  <Route path ="/customer/orderlist" element={<OrderList/>}/>
                  <Route path ="/customer/reviews/:id" element={<ReviewOfProducts/>}/>
                </Route>
              </Routes>
            </Suspense>
          </ErrorBoundary>
            
      </BrowserRouter>
    </Box>
  )
}

export default App
