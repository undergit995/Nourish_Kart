import { Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Navbar from "../../Themes/Navbar"
import Banner from "../../Themes/Banner"
import Footer from "../../Themes/Footer"
import Products from "../../Themes/Products"
import { useDispatch, useSelector } from "react-redux";
import { fetchCompanyInfo } from "../../Redux/Slices/AdminSlice/CompanyInfoSlice";
import { fetchBanners } from "../../Redux/Slices/BannerSlice";

function LandingPage() {
  const company = useSelector((state) => state.companyInfo.info);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCompanyInfo());
    dispatch(fetchBanners());
  }, [dispatch]);

  return (
    <Box>
        <Banner />
        <Products/>
        <Footer company={company}/>
    </Box>
  )
}

export default LandingPage