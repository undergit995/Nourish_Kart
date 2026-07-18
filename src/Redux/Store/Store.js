import { configureStore } from "@reduxjs/toolkit"
import productReducer from "../Slices/productSlice"
import userReducer from "../Slices/userSlice"
import CartSlice from "../Slices/CM_CartSlice"
import CustomerEditProfile from "../Slices/CM_ProfileSlice"
import ReviewSlice from "../Slices/ReviewSlice"
import OfferSlice from "../Slices/OffserSlice"
import OrderListSlice from "../Slices/AdminSlice/OrderListSlice"
import CustomerOrderSlicee from "../Slices/CustomerSlice/CustomerOrderSlice"
import CompanyInfoSlice from "../Slices/AdminSlice/CompanyInfoSlice"
import bannerSlice from "../Slices/BannerSlice"

const store = configureStore({
    reducer: {
        product: productReducer,
        user: userReducer,
        editprofile: CustomerEditProfile,
        cart: CartSlice,
        Review: ReviewSlice,
        Offer: OfferSlice,
        orderlist:OrderListSlice,
        customerOrder:CustomerOrderSlicee,
        companyInfo:CompanyInfoSlice,
        banners:bannerSlice,
    }
})

export default store